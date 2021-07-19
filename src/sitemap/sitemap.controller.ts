import { Controller, Get, Header } from "@nestjs/common";
import { TopPageService } from "../top-page/top-page.service";
import { ConfigService } from "@nestjs/config";
import { format, subDays } from "date-fns";
import { Builder } from 'xml2js';
import { CATEGORY_URL } from "./sitemap.constants";

@Controller('sitemap')
export class SitemapController {
  domain: string;    // поле, куда будет сохраняться доменное имя

  constructor(
    private readonly topPageService: TopPageService,
    private readonly configService: ConfigService
  ) {
    this.domain = this.configService.get('DOMAIN') ?? '';  // если в .env есть имя домена, берём оттуда, если нет, присваиваем значением пустую строку
  }

  @Get('xml')   // Get, т.к. роботы обходят сайты xml методом GET
  @Header('content-type', 'text/xml') // @Header() позволяет переопределить заголовки (Headers), которые будет возвращать метод. Первый параметр - какой заголовок переопределяем, второй параметр - значение заголовка  В данном случае нужно переопределить Content-type, сделав его "text/xml". Всё, что возвращается из метода будет иметь в Headers соответствующий content-type
  async sitemap() {
    const formatString: string = 'yyyy-MM-dd\'T\'HH:mm:00.000xxx'; // регекс (для библ. date-fns) для даты времени. (Примерно 2021-04-01T18:20:00.00)
    // res - массив данных для заполнения блоков xml со страницами проекта для sitemap (loc - адрес страницы, lastmod - дата послдней модификации страницы, changefreq - частота изменения страницы, priority - приоритет прохода роботом страницы)
    let res = [{    // БЛОК №1: Страница по доменному адрсу проекта (корневая страница)
      loc: this.domain,   // корневой адрес (домен)
      lastmod: format(subDays(new Date(), 1), formatString),   // вчерашняя дата  (метод subDays вычитает из переданной даты (первый аргумент) Х дней (второй аргумент)), форматированная в строку (библ. date-fns)
      changefreq: 'daily',   // как часто данные по адресу (loc) модифицируются
      priority: '1.0'   // приоритет поиска (у главной странице приоритет всегда должен быть 1)
    },
      {             // БЛОК №2: Страница с курсами
      loc: `${this.domain}/courses`,   // страничка с курсами
      lastmod: format(subDays(new Date(), 1), formatString),
      changefreq: 'daily',
      priority: '1.0'
    }];
    // динамическое подтягивание всех страниц:
    const pages = await this.topPageService.findAll();  // возвращает массив со всеми страницами
    res = res.concat(pages.map(page => {   // БЛОКИ №3...: Динамически сгенерированные блоки для всех станиц topPage (concat - добавляем в существующий массив новые элементы)
      return {
        loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${page.alias}`,   // страничка с курсами. Динамически генерируется в дависимости от значенея page.firstCategory
        lastmod: format(new Date(page.updatedAt ?? new Date()), formatString), // если поле page.updatedAt имеет значение (Date), форматируем его. Если не имеет (??) (undefined) - форматируем актуальную дату
        changefreq: 'weekly',
        priority: '0.7'
      }
    }))
    const builder = new Builder({
      xmldec: { version: '1.0', encoding: 'UTF-8' }
    })
    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'https://www.sitemaps.org/schemas/sitemap/0.9'
        },
        url: res
      }
    })
  }
}


/*
*   npm i xml2js  - для баробы с xml-контентом
*   npm i -D @types/xml2js
* */

/*
        ИСКОМЫЙ ВИД xml-файла:
        <?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://test.ua</loc>
    <lastmod>2021-07-18T00:21:00.000+03:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://test.ua/courses</loc>
    <lastmod>2021-07-18T00:21:00.000+03:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://test.ua/services/TypeScript</loc>
    <lastmod>2021-07-12T00:34:00.000+03:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://test.ua/services/typescript</loc>
    <lastmod>2021-07-11T19:30:00.000+03:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://test.ua/services/Java</loc>
    <lastmod>2021-07-11T19:31:00.000+03:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
 */
