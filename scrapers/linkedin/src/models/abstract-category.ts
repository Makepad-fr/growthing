export default interface AbstractCategory {
  name: string;
  subcategories: AbstractSubCategory[];
  url: string;
}

export interface AbstractSubCategory {
  name: string;
  url: string;
}
