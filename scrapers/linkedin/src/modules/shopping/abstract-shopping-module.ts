import AbstractModule from '../abstract-module';
import AbstractCategoryListModule from './abstract-category-list-module';

export default abstract class AbstractShoppingModule extends AbstractModule {
  // TODO: Add abstract function to get the product list module
  abstract categoryList(): Promise<AbstractCategoryListModule>;
  // TODO: Add abstract function to get the product details module
  // TODO: Add abstract function to get category list module
  // TODO: Add abstract function to get category details module
}
