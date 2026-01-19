import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

interface CreateTransactionData {
  amount: number;
  source: string;
  categoryId: string;
  userId: string;
  transactionDate: Date | string;
  notes?: string;
}

interface UpdateTransactionData {
  amount?: number;
  source?: string;
  categoryId?: string;
  transactionDate?: Date | string;
  notes?: string;
}

interface AuditContext {
  ipAddress?: string;
  userAgent?: string;
}

interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  search?: string;
  page: number;
  limit: number;
}

export const createTransaction = async (
  data: CreateTransactionData,
  context: AuditContext
) => {
  // Verify category exists and user has access
  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      OR: [
        { userId: data.userId },
        { isDefault: true },
      ],
    },
  });

  if (!category) {
    throw new Error('Invalid category');
  }

  // Create transaction and audit log in a transaction
  const transaction = await prisma.$transaction(async (tx) => {
    const newTransaction = await tx.transaction.create({
      data: {
        amount: new Decimal(data.amount),
        source: data.source,
        categoryId: data.categoryId,
        userId: data.userId,
        transactionDate: new Date(data.transactionDate),
        notes: data.notes,
      },
      include: {
        category: true,
      },
    });

    // Create audit log
    await tx.auditLog.create({
      data: {
        userId: data.userId,
        transactionId: newTransaction.id,
        action: 'CREATE',
        entityType: 'transaction',
        entityId: newTransaction.id,
        newValue: {
          amount: data.amount,
          source: data.source,
          categoryId: data.categoryId,
          transactionDate: data.transactionDate,
          notes: data.notes,
        },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    return newTransaction;
  });

  return transaction;
};

export const getTransactions = async (userId: string, filters: TransactionFilters) => {
  const { startDate, endDate, categoryId, search, page, limit } = filters;

  interface WhereClause {
    userId: string
    deletedAt: null
    transactionDate?: {
      gte?: Date
      lte?: Date
    }
    categoryId?: string
    OR?: Array<{
      source?: { contains: string; mode: 'insensitive' }
      notes?: { contains: string; mode: 'insensitive' }
    }>
  }

  const where: WhereClause = {
    userId,
    deletedAt: null,
  };

  if (startDate || endDate) {
    where.transactionDate = {};
    if (startDate) {
      where.transactionDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.transactionDate.lte = new Date(endDate);
    }
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.OR = [
      { source: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        transactionDate: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getTransactionById = async (id: string, userId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
    include: {
      category: true,
    },
  });

  return transaction;
};

export const updateTransaction = async (
  id: string,
  userId: string,
  data: UpdateTransactionData,
  context: AuditContext
) => {
  // Get existing transaction
  const existingTransaction = await getTransactionById(id, userId);

  if (!existingTransaction) {
    throw new Error('Transaction not found');
  }

  // Verify category if being updated
  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        OR: [
          { userId },
          { isDefault: true },
        ],
      },
    });

    if (!category) {
      throw new Error('Invalid category');
    }
  }

  // Update transaction and create audit log
  const transaction = await prisma.$transaction(async (tx) => {
    const updateData: any = {};

    if (data.amount !== undefined) {
      updateData.amount = new Decimal(data.amount);
    }
    if (data.source !== undefined) {
      updateData.source = data.source;
    }
    if (data.categoryId !== undefined) {
      updateData.categoryId = data.categoryId;
    }
    if (data.transactionDate !== undefined) {
      updateData.transactionDate = new Date(data.transactionDate);
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const updatedTransaction = await tx.transaction.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    // Create audit log
    await tx.auditLog.create({
      data: {
        userId,
        transactionId: id,
        action: 'UPDATE',
        entityType: 'transaction',
        entityId: id,
        oldValue: {
          amount: existingTransaction.amount.toString(),
          source: existingTransaction.source,
          categoryId: existingTransaction.categoryId,
          transactionDate: existingTransaction.transactionDate.toISOString(),
          notes: existingTransaction.notes || '',
        } as any,
        newValue: {
          amount: data.amount?.toString(),
          source: data.source,
          categoryId: data.categoryId,
          transactionDate: data.transactionDate?.toString(),
          notes: data.notes,
        } as any,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    return updatedTransaction;
  });

  return transaction;
};

export const deleteTransaction = async (
  id: string,
  userId: string,
  context: AuditContext
) => {
  const existingTransaction = await getTransactionById(id, userId);

  if (!existingTransaction) {
    throw new Error('Transaction not found');
  }

  // Soft delete and create audit log
  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // Create audit log
    await tx.auditLog.create({
      data: {
        userId,
        transactionId: id,
        action: 'DELETE',
        entityType: 'transaction',
        entityId: id,
        oldValue: {
          amount: existingTransaction.amount.toString(),
          source: existingTransaction.source,
          categoryId: existingTransaction.categoryId,
          transactionDate: existingTransaction.transactionDate,
          notes: existingTransaction.notes,
        },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });
  });
};
