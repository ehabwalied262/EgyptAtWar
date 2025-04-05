import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="text-white font-[Amiri] px-6 py-12">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.8 }}
      >
        من نحن؟
      </motion.h1>

      <motion.p
        className="text-lg leading-8 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <strong>نحن فريق مدني مصري</strong>، لا نسعى لتطبيق شرع الله بالقوة،
        ولا نطمح إلى السلطة أبدًا. لسنا ملحدين أيضًا، بل مصريون عاديون جدًا،
        بدأنا من الصفر، أو ربما من تحت الصفر.
      </motion.p>

      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        لماذا وُجدنا؟
      </motion.h2>

      <motion.p
        className="text-lg leading-8 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        جاء وجودنا من شعور السأم من الركود التام الذي نعيشه منذ سنوات
        طويلة، ركود فكري ومجتمعي استمر لعقود. فتحنا أعيننا على واقع مؤلم:
        إسرائيل ترتكب جرائم بحقنا وبحق إخوتنا في فلسطين، غزة، سوريا، ولبنان.
        دائمًا نجد شماعة جاهزة نعلق عليها أسبابنا: "أمريكا تدعمهم"، "حكوماتنا
        والأنظمة العربية فاسدة". قد أتفق معك في هذا، لكن السياسة لها توازناتها،
        وليست كل مشكلة ستُحل بإسقاط نظام.
      </motion.p>

      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        أين دورنا كمجتمع؟
      </motion.h2>

      <motion.p
        className="text-lg leading-8 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        الصهيونية لن تتوقف أبدًا عن دعم إسرائيل عبر رجال أعمالها الذين يمولون
        فكرتهم لتنمو وتزدهر. بينما نحن في الوطن العربي، نتصرف كالطفل الصغير
        الذي ينتظر الحكومة لتعمل كل شيء. لكن الحكومة لم تفعل، وغالبًا لن تفعل،
        لأنها كحكومة ديكتاتورية لا تضع تطوير التعليم ضمن أولوياتها، ولا تسعى
        لإنتاج مفكرين وعلماء وناجحين مصريين. لماذا؟ لأن اليوم الذي نتعلم فيه
        تعليمًا جيدًا وننجح، سنبدأ بالمطالبة والسؤال، وهذا ما لا تريده الأنظمة،
        فهو يسبب لها القلق والإزعاج الذي تستغني عنه.
      </motion.p>

      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        ماذا نريد؟
      </motion.h2>

      <motion.p
        className="text-lg leading-8 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        عندما أرادت إسرائيل أن تضمن ألا تقوم لأمتنا قائمة، اغتالت علماءنا
        ومفكرينا: مصطفى مشرفة، سميرة موسى، يحيى المشد، جمال حمدان. أقل ما
        يمكننا فعله هو أن نثبت لهم أن دماء هؤلاء لم تذهب هدرًا، وأننا قادرون
        على مواصلة مسيرتهم. ليس شرطًا أن تكون عالم فيزياء أو كيمياء، لكن يمكنك
        أن تمول أو تشارك في تمويل دراسة شاب أو شابة مصرية أثبتت جدارتها في
        الفيزياء، الكيمياء، أو أي مجال مطلوب حاليًا في جامعة أوروبية.
      </motion.p>

      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        كيف نغير؟
      </motion.h2>

      <motion.p
        className="text-lg leading-8 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        أدرك أن أغلبنا محدود الموارد، وليس لدينا الغنى الكافي لتمويل مشاريع
        ضخمة. لكن من خلال عملي في المجال الخيري، لاحظت أن الناس تصرف زكاتها
        وصدقاتها على أشياء جيدة، لكنها ليست جوهرية بما يكفي لتُحدث تغييرًا
        ملموسًا في المجتمع. عندما توزع بطانيات أو وجبات طعام، أنت تخلق طبقة
        تعتمد عليك لتوفر لها كل شيء، وتنتظرك لتأتي بالوجبة التالية. هذا ليس
        عمليًا على الإطلاق.
      </motion.p>

      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        المقاطعة والبديل
      </motion.h2>

      <motion.p
        className="text-lg leading-8 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        أما عن المقاطعة، فمن العبث أن تظل محصورة في ماكدونالدز وشيبسي وبيبسي
        فقط. خطتنا يجب أن تكون أكبر: تصنيع منتج بديل بنفس الجودة. المقاطعة وحدها
        لن تدوم، لأن الناس لن تستطيع الاستمرار فيها. لكن إذا صنعنا بديلًا محليًا،
        ستكون المقاطعة سلاحًا فعالًا، بل ومصدر رزق للكثيرين الذين سنوظفهم.
      </motion.p>

      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        أولوياتنا
      </motion.h2>

      <motion.p
        className="text-lg leading-8 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        لفت انتباهي مشهد توقف الطواف حول الكعبة في عمرة رمضان. ثلاثة ملايين مسلم،
        جزء كبير منهم مصريون، ذهبوا لأداء سنة وليس فرضًا. لم نفكر يومًا في توجيه
        هذا المال لتمويل تعليم 100 شاب أو شابة في علوم نافعة تفيد أمتنا، سواء بفتح
        شركات أو مصانع، أو منافسة منتجات وخدمات الغرب.
      </motion.p>

      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        لماذا نحن ضعفاء؟
      </motion.h2>

      <motion.p
        className="text-lg leading-8 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        لأننا نعتمد على الغرب في كل شيء. وللأسف، لو ظللنا نطالب حكوماتنا
        بالتغيير، لن تستمع، وقد نُحبس أو نختفي قسريًا في وطن عربي يحكمه القمع
        واضطهاد أي صوت ينادي بالتغيير.
      </motion.p>

      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        فكرتنا
      </motion.h2>

      <motion.p
        className="text-lg leading-8 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        لذلك، جاءت فكرتنا: أن نبدأ التغيير بأنفسنا، بدون أجندة سياسية. لا نريد
        تغيير نظام، ولا ثورة، ولا فرض شرع الله بالقوة، ولا نسعى للسلطة. نريد فقط
        أن يدرك الناس أن علينا العمل، وألا ننتظر الحكومة لتغير شيئًا، لأنها
        مستفيدة من الوضع الحالي.
      </motion.p>
    </div>
  );
}
