export interface Category {
  id: string
  name: string
  color: string
  isDefault: boolean
  userId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryData {
  name: string
  color?: string
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string
}
