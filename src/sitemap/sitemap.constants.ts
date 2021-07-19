import { TopLevelCategory } from "../top-page/top-page.model";

type RoutMapType = Record<TopLevelCategory, string>; // тип определяет мапу на основе ENUM TopLevelCategory (см. TopLevelModel). Ключ - индекс элемента ENUMa, значенее - строка с роутом

export const CATEGORY_URL: RoutMapType = {  // мапа-константа для правильного генерирования роутов (путей) в файле xml (sitemapController)
  0: '/courses',     // ключ - индекс Enum-элемента TopLevelCategory, значение - строка с роутом
  1: '/services',
  2: '/books',
  3: '/products'
}
