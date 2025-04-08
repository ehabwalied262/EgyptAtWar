import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getArticlesByProblem(problem: string) {
  // خريطة تحويل الأسماء العربية إلى أسماء المجلدات الإنجليزية
  const problemFolderMap: Record<string, string> = {
    "الفقر": "poverty",
    "هجرة العقول": "brain-drain",
    "التعليم": "poor-education",
    "ضرب الأطفال": "child-abuse",
    "الفساد الإداري والرشوة": "corruption-bribery",
    "العنوسة وتأخر الزواج": "delayed-marriage",
    "الإعلام المضلل": "fake-media",
    "التحرش والعنف ضد المرأة": "harassment-violence-against-women",
    "المتشردين": "homelessness",
    "أزمة السكن والعشوائيات": "housing-crisis-slums",
    "غياب المحتوى الهادف": "lack-of-purposeful-content",
    "سوء التغذية": "malnutrition",
    "الفهم الخاطئ للدين": "misunderstanding-of-religion",
    "التربية": "parenting",
    "الزيادة السكانية": "population-growth",
    "عجز الميزان التجاري": "trade-deficit",
    "المرور والفوضى المرورية": "traffic-traffic-chaos",
    "البطالة": "unemployment",
    "أزمة المياه والتصحر": "water-crisis-desertification",
    "ضعف الهوية الثقافية": "weak-cultural-identity",
    "ضعف الخدمات الصحية": "weak-healthcare-services",
    "ضعف البحث العلمي": "weak-research-innovation",
    "الإدمان": "addiction"
  };

  // استخدام الخريطة للتحويل من اسم المشكلة بالعربية إلى اسم المجلد بالإنجليزية
  const problemSlug = problemFolderMap[problem] || problem.toLowerCase().replace(/\s+/g, '-');

  // تحديد المسار إلى مجلد المقالات
  const articlesDirectory = path.join(process.cwd(), 'src/content/articles', problemSlug);

  // التأكد من وجود المجلد
  if (!fs.existsSync(articlesDirectory)) {
    throw new Error(`No articles found for problem: ${problemSlug}`);
  }

  // قراءة الملفات في المجلد المحدد
  const filenames = fs.readdirSync(articlesDirectory);

  // تحويل كل ملف إلى كائن يحتوي على بيانات المقال
  const articles = filenames.map((filename) => {
    // التأكد أن اسم الملف ليس فارغًا أو غير معرف
    if (!filename) {
      return null;
    }

    const filePath = path.join(articlesDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // استخراج البيانات من frontmatter باستخدام gray-matter
    const { data, content } = matter(fileContent);

    return {
      slug: filename.replace(/\.md$/, ''), // استخدام اسم الملف كـ slug
      title: data.title,
      description: data.description,
      image: data.image,
      content, // محتوى المقال
    };
  }).filter(article => article !== null); // إزالة العناصر الفارغة

  return articles;
}
