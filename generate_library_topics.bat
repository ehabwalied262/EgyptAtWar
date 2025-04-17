@echo off
setlocal enabledelayedexpansion

:: Create the channels directory inside src/content
if not exist "src\content\channels" (
    mkdir "src\content\channels"
)

:: Create Business Section
mkdir "content\channels\business"
(
echo ---
echo category: business
echo title: Business
echo ---
echo.
echo ## قنوات يوتيوب لقسم البيزنس
echo.
echo - **اسم القناة**: Business Insights  
echo   **Channel ID**: UC1234567890  
echo   **الوصف**: قناة تقدم نصايح للمبتدئين في عالم البيزنس وريادة الأعمال.
echo.
echo - **اسم القناة**: Entrepreneur Hub  
echo   **Channel ID**: UC0987654321  
echo   **الوصف**: قناة بتركز على أخطاء شائعة في البيزنس وإزاي تتجنبها.
echo.
echo - **اسم القناة**: Startup Central  
echo   **Channel ID**: UC5555555555  
echo   **الوصف**: قناة بتساعدك تبدأ شركتك من الصفر بطريقة عملية.
echo.
echo - **اسم القناة**: Business Growth  
echo   **Channel ID**: UC1112223333  
echo   **الوصف**: قناة بتقدم استراتيجيات لتوسيع الأعمال.
echo.
echo - **اسم القناة**: Money Makers  
echo   **Channel ID**: UC4445556666  
echo   **الوصف**: قناة بتركز على طرق زيادة الأرباح في البيزنس.
) > "content\channels\business\index.md"

:: Create Nutrition Section
mkdir "content\channels\nutrition"
(
echo ---
echo category: nutrition
echo title: Nutrition
echo ---
echo.
echo ## قنوات يوتيوب لقسم التغذية
echo.
echo - **اسم القناة**: Healthy Eating Hub  
echo   **Channel ID**: UC7778889990  
echo   **الوصف**: قناة بتقدم نصايح يومية لتناول طعام صحي.
echo.
echo - **اسم القناة**: Nutrition Basics  
echo   **Channel ID**: UC2223334444  
echo   **الوصف**: قناة بتعلمك أساسيات التغذية السليمة.
echo.
echo - **اسم القناة**: Food for Life  
echo   **Channel ID**: UC5556667777  
echo   **الوصف**: قناة بتركز على وصفات صحية تناسب كل الأعمار.
echo.
echo - **اسم القناة**: Diet Guide  
echo   **Channel ID**: UC8889990000  
echo   **الوصف**: قناة بتساعدك تختار نظام غذائي مناسب.
echo.
echo - **اسم القناة**: Wellness Journey  
echo   **Channel ID**: UC1112223334  
echo   **الوصف**: قناة بتقدم نصايح لتحسين الصحة من خلال التغذية.
) > "content\channels\nutrition\index.md"

:: Create Psychology Section
mkdir "content\channels\psychology"
(
echo ---
echo category: psychology
echo title: Psychology
echo ---
echo.
echo ## قنوات يوتيوب لقسم علم النفس
echo.
echo - **اسم القناة**: Mind Matters  
echo   **Channel ID**: UC9990001111  
echo   **الوصف**: قناة بتشرح مفاهيم علم النفس بطريقة بسيطة.
echo.
echo - **اسم القناة**: Psych Insights  
echo   **Channel ID**: UC2223334445  
echo   **الوصف**: قناة بتقدم تحليلات نفسية لسلوكيات يومية.
echo.
echo - **اسم القناة**: Brainy Talks  
echo   **Channel ID**: UC5556667778  
echo   **الوصف**: قناة بتركز على العلاقة بين الدماغ والسلوك.
echo.
echo - **اسم القناة**: Emotional Wellness  
echo   **Channel ID**: UC8889990001  
echo   **الوصف**: قناة بتساعدك تفهم مشاعرك وتديرها.
echo.
echo - **اسم القناة**: Psychology 101  
echo   **Channel ID**: UC1112223335  
echo   **الوصف**: قناة تعليمية للمبتدئين في علم النفس.
) > "content\channels\psychology\index.md"

:: Create Nursing Section
mkdir "content\channels\nursing"
(
echo ---
echo category: nursing
echo title: Nursing
echo ---
echo.
echo ## قنوات يوتيوب لقسم التمريض
echo.
echo - **اسم القناة**: Nurse Academy  
echo   **Channel ID**: UC2222222222  
echo   **الوصف**: قناة تعليمية لطلاب التمريض بتقدم دروس أساسية.
echo.
echo - **اسم القناة**: Health Care Basics  
echo   **Channel ID**: UC3333333333  
echo   **الوصف**: قناة بتركز على العناية بالمرضى ومهارات التمريض.
echo.
echo - **اسم القناة**: Nursing Tips  
echo   **Channel ID**: UC4444444444  
echo   **الوصف**: قناة بتقدم نصايح يومية للممرضين المبتدئين.
echo.
echo - **اسم القناة**: Caregiver Guide  
echo   **Channel ID**: UC5555555556  
echo   **الوصف**: قناة بتساعد الممرضين على تحسين مهاراتهم.
echo.
echo - **اسم القناة**: Medical Essentials  
echo   **Channel ID**: UC6666666667  
echo   **الوصف**: قناة بتقدم شروحات طبية بسيطة للممرضين.
) > "content\channels\nursing\index.md"

:: Create History Section
mkdir "content\channels\history"
(
echo ---
echo category: history
echo title: History
echo ---
echo.
echo ## قنوات يوتيوب لقسم التاريخ
echo.
echo - **اسم القناة**: History Uncovered  
echo   **Channel ID**: UC7777777777  
echo   **الوصف**: قناة بتكشف أسرار التاريخ بطريقة ممتعة.
echo.
echo - **اسم القناة**: Past Chronicles  
echo   **Channel ID**: UC8888888888  
echo   **الوصف**: قناة بتروي قصص تاريخية من العصور القديمة.
echo.
echo - **اسم القناة**: Time Travelers  
echo   **Channel ID**: UC9999999999  
echo   **الوصف**: قناة بتشرح الأحداث التاريخية بأسلوب شيق.
echo.
echo - **اسم القناة**: Ancient Tales  
echo   **Channel ID**: UC0000000000  
echo   **الوصف**: قناة بتركز على تاريخ الحضارات القديمة.
echo.
echo - **اسم القناة**: History Lessons  
echo   **Channel ID**: UC1111111111  
echo   **الوصف**: قناة تعليمية بتقدم دروس تاريخ مبسطة.
) > "content\channels\history\index.md"

echo Done! Dummy channel files have been created.
pause