
(function() {
  'use strict';

  // =========================================================================
  // GROUNDED COURSE DATA (Strictly from the 7 Attached Lectures)
  // =========================================================================
  const LECTURE_IMG_STORE = {"img_001": "img/img_001.webp", "img_002": "img/img_002.webp", "img_003": "img/img_003.webp", "img_004": "img/img_004.webp", "img_005": "img/img_005.webp", "img_006": "img/img_006.webp", "img_007": "img/img_007.webp", "img_008": "img/img_008.webp", "img_009": "img/img_009.webp", "img_010": "img/img_010.webp", "img_011": "img/img_011.webp", "img_012": "img/img_012.webp", "img_013": "img/img_013.webp", "img_014": "img/img_014.webp", "img_015": "img/img_015.webp", "img_016": "img/img_016.webp", "img_017": "img/img_017.webp", "img_018": "img/img_018.webp", "img_019": "img/img_019.webp", "img_020": "img/img_020.webp", "img_021": "img/img_021.webp", "img_022": "img/img_022.webp", "img_023": "img/img_023.webp", "img_024": "img/img_024.webp", "img_025": "img/img_025.webp", "img_026": "img/img_026.webp", "img_027": "img/img_027.webp", "img_028": "img/img_028.webp", "img_029": "img/img_029.webp", "img_030": "img/img_030.webp", "img_031": "img/img_031.webp", "img_032": "img/img_032.webp", "img_033": "img/img_033.webp", "img_034": "img/img_034.webp", "img_035": "img/img_035.webp", "img_036": "img/img_036.webp", "img_037": "img/img_037.webp", "img_038": "img/img_038.webp", "img_039": "img/img_039.webp", "img_040": "img/img_040.webp", "img_041": "img/img_041.webp", "img_042": "img/img_042.webp", "img_043": "img/img_043.webp", "img_044": "img/img_044.webp", "img_045": "img/img_045.webp", "img_046": "img/img_046.webp", "img_047": "img/img_047.webp", "img_048": "img/img_048.webp", "img_049": "img/img_049.webp", "img_050": "img/img_050.webp", "img_051": "img/img_051.webp", "img_052": "img/img_052.webp", "img_053": "img/img_053.webp", "img_054": "img/img_054.webp", "img_055": "img/img_055.webp", "img_056": "img/img_056.webp", "img_057": "img/img_057.webp", "img_058": "img/img_058.webp", "img_059": "img/img_059.webp", "img_060": "img/img_060.webp", "img_061": "img/img_061.webp", "img_062": "img/img_062.webp", "img_063": "img/img_063.webp", "img_064": "img/img_064.webp", "img_065": "img/img_065.webp", "img_066": "img/img_066.webp", "img_067": "img/img_067.webp", "img_068": "img/img_068.webp", "img_069": "img/img_069.webp", "img_070": "img/img_070.webp", "img_071": "img/img_071.webp", "img_072": "img/img_072.webp", "img_073": "img/img_073.webp", "img_074": "img/img_074.webp", "img_075": "img/img_075.webp", "img_076": "img/img_076.webp", "img_077": "img/img_077.webp", "img_078": "img/img_078.webp", "img_079": "img/img_079.webp", "img_080": "img/img_080.webp", "img_081": "img/img_081.webp", "img_082": "img/img_082.webp", "img_083": "img/img_083.webp", "img_084": "img/img_084.webp", "img_085": "img/img_085.webp", "img_086": "img/img_086.webp", "img_087": "img/img_087.webp", "img_088": "img/img_088.webp", "img_089": "img/img_089.webp", "img_090": "img/img_090.webp", "img_091": "img/img_091.webp", "img_092": "img/img_092.webp", "img_093": "img/img_093.webp", "img_094": "img/img_094.webp", "img_095": "img/img_095.webp", "img_096": "img/img_096.webp", "img_097": "img/img_097.webp", "img_098": "img/img_098.webp", "img_099": "img/img_099.webp", "img_100": "img/img_100.webp", "img_101": "img/img_101.webp", "img_102": "img/img_102.webp", "img_103": "img/img_103.webp", "img_104": "img/img_104.webp", "img_105": "img/img_105.webp", "img_106": "img/img_106.webp", "img_107": "img/img_107.webp", "img_108": "img/img_108.webp", "img_109": "img/img_109.webp", "img_110": "img/img_110.webp", "img_111": "img/img_111.webp", "img_112": "img/img_112.webp", "img_113": "img/img_113.webp", "img_114": "img/img_114.webp", "img_115": "img/img_115.webp", "img_116": "img/img_116.webp", "img_117": "img/img_117.webp", "img_118": "img/img_118.webp", "img_119": "img/img_119.webp", "img_120": "img/img_120.webp", "img_121": "img/img_121.webp", "img_122": "img/img_122.webp", "img_123": "img/img_123.webp", "img_124": "img/img_124.webp", "img_125": "img/img_125.webp", "img_126": "img/img_126.webp", "img_127": "img/img_127.webp", "img_128": "img/img_128.webp", "img_129": "img/img_129.webp", "img_130": "img/img_130.webp", "img_131": "img/img_131.webp", "img_132": "img/img_132.webp", "img_133": "img/img_133.webp", "img_134": "img/img_134.webp", "img_135": "img/img_135.webp", "img_136": "img/img_136.webp", "img_137": "img/img_137.webp", "img_138": "img/img_138.webp", "img_139": "img/img_139.webp", "img_140": "img/img_140.webp", "img_141": "img/img_141.webp", "img_142": "img/img_142.webp", "img_143": "img/img_143.webp", "img_144": "img/img_144.webp", "img_145": "img/img_145.webp", "img_146": "img/img_146.webp", "img_147": "img/img_147.webp", "img_148": "img/img_148.webp", "img_149": "img/img_149.webp", "img_150": "img/img_150.webp", "img_151": "img/img_151.webp", "img_152": "img/img_152.webp", "img_153": "img/img_153.webp", "img_154": "img/img_154.webp", "img_155": "img/img_155.webp", "img_156": "img/img_156.webp", "img_157": "img/img_157.webp", "img_158": "img/img_158.webp", "img_159": "img/img_159.webp", "img_160": "img/img_160.webp", "img_161": "img/img_161.webp", "img_162": "img/img_162.webp", "img_163": "img/img_163.webp", "img_164": "img/img_164.webp", "img_165": "img/img_165.webp", "img_166": "img/img_166.webp", "img_167": "img/img_167.webp", "img_168": "img/img_168.webp", "img_169": "img/img_169.webp", "img_170": "img/img_170.webp"};
  const LECTURE_GALLERIES = {"1": [{"id": "img_001", "slide": 3, "caption": "What is Building Construction? — Building construction, often referred to simply a..."}, {"id": "img_002", "slide": 5, "caption": "توضيح من المحاضرة الأولى — مقدمة وأحمال المباني"}, {"id": "img_003", "slide": 5, "caption": "توضيح من المحاضرة الأولى — مقدمة وأحمال المباني"}, {"id": "img_004", "slide": 5, "caption": "توضيح من المحاضرة الأولى — مقدمة وأحمال المباني"}, {"id": "img_005", "slide": 5, "caption": "توضيح من المحاضرة الأولى — مقدمة وأحمال المباني"}, {"id": "img_006", "slide": 6, "caption": "توضيح من المحاضرة الأولى — مقدمة وأحمال المباني"}, {"id": "img_007", "slide": 6, "caption": "توضيح من المحاضرة الأولى — مقدمة وأحمال المباني"}, {"id": "img_008", "slide": 6, "caption": "توضيح من المحاضرة الأولى — مقدمة وأحمال المباني"}, {"id": "img_009", "slide": 6, "caption": "توضيح من المحاضرة الأولى — مقدمة وأحمال المباني"}, {"id": "img_010", "slide": 9, "caption": "Dead Loads Live Permanent load from the weight of the structure itself and any fix..."}, {"id": "img_011", "slide": 10, "caption": "Dead Loads Live Permanent load from the weight of the structure itself and any fix..."}, {"id": "img_012", "slide": 11, "caption": "Wind Loads  Load exerted on the beam due to wind pressure. Roofs and Facades — bui..."}, {"id": "img_013", "slide": 12, "caption": "Live Loads Live loads are moveable or temporarily attached to a structure. They in..."}, {"id": "img_014", "slide": 12, "caption": "Live Loads Live loads are moveable or temporarily attached to a structure. They in..."}], "2": [{"id": "img_015", "slide": 13, "caption": "Lecture 2: Building Systems"}, {"id": "img_004", "slide": 13, "caption": "Lecture 2: Building Systems"}, {"id": "img_002", "slide": 13, "caption": "Lecture 2: Building Systems"}, {"id": "img_003", "slide": 13, "caption": "Lecture 2: Building Systems"}, {"id": "img_016", "slide": 13, "caption": "Lecture 2: Building Systems"}, {"id": "img_017", "slide": 14, "caption": "What is “Simple Beam System”? — Lecture 2: Building Systems"}, {"id": "img_018", "slide": 15, "caption": "What is “Simple Beam System”? — Simple Beam System, A Simple Beam System is a stru..."}, {"id": "img_019", "slide": 18, "caption": "Lecture 2: Building Systems (Simple Beam) — Structural members ( Slabs)"}, {"id": "img_020", "slide": 19, "caption": "Lecture 2: Building Systems (Simple Beam) — 1- Structural members ( Slabs)"}, {"id": "img_021", "slide": 19, "caption": "Lecture 2: Building Systems (Simple Beam) — 1- Structural members ( Slabs)"}, {"id": "img_022", "slide": 19, "caption": "Lecture 2: Building Systems (Simple Beam) — 1- Structural members ( Slabs)"}, {"id": "img_023", "slide": 19, "caption": "Lecture 2: Building Systems (Simple Beam) — 1- Structural members ( Slabs)"}, {"id": "img_024", "slide": 20, "caption": "Lecture 2: Building Systems (Simple Beam) — 1- Structural members ( Slabs)"}, {"id": "img_025", "slide": 21, "caption": "Lecture 2: Building Systems (Simple Beam) — 1-Structural members ( Slabs)"}, {"id": "img_026", "slide": 22, "caption": "Lecture 2: Building Systems (Simple Beam) — 2-Structural members ( Beams)"}, {"id": "img_027", "slide": 22, "caption": "Lecture 2: Building Systems (Simple Beam) — 2-Structural members ( Beams)"}, {"id": "img_028", "slide": 23, "caption": "Types of beam structure:  There are a few primary types of beams used in construct..."}, {"id": "img_029", "slide": 24, "caption": "Lecture 2: Building Systems (Simple Beam) — 2-Structural members ( Beams)"}, {"id": "img_030", "slide": 25, "caption": "Types of beam structure There are a few primary types of beams used in constructio..."}, {"id": "img_031", "slide": 26, "caption": "Main Beam — Secondary Beam"}, {"id": "img_032", "slide": 27, "caption": "تفاصيل وتنفيذ نظام الكمرات البسيطة (Simple Beam)"}, {"id": "img_033", "slide": 27, "caption": "تفاصيل وتنفيذ نظام الكمرات البسيطة (Simple Beam)"}, {"id": "img_034", "slide": 27, "caption": "تفاصيل وتنفيذ نظام الكمرات البسيطة (Simple Beam)"}, {"id": "img_035", "slide": 27, "caption": "تفاصيل وتنفيذ نظام الكمرات البسيطة (Simple Beam)"}, {"id": "img_036", "slide": 28, "caption": "Lecture 2: Building Systems (Simple Beam) — 3-Structural members ( Columns)"}, {"id": "img_037", "slide": 28, "caption": "Lecture 2: Building Systems (Simple Beam) — 3-Structural members ( Columns)"}, {"id": "img_038", "slide": 29, "caption": "Lecture 2: Building Systems (Simple Beam) — 3-Structural members ( Columns)"}, {"id": "img_039", "slide": 30, "caption": "Lecture 2: Building Systems (Simple Beam) — How is the Simple Beam System Construc..."}, {"id": "img_040", "slide": 30, "caption": "Lecture 2: Building Systems (Simple Beam) — How is the Simple Beam System Construc..."}, {"id": "img_041", "slide": 31, "caption": "Lecture 2: Building Systems (Simple Beam)"}, {"id": "img_042", "slide": 32, "caption": "Lecture 2: Building Systems (Simple Beam)"}, {"id": "img_043", "slide": 32, "caption": "Lecture 2: Building Systems (Simple Beam)"}, {"id": "img_044", "slide": 33, "caption": "Lecture 2: Building Systems (Simple Beam)"}, {"id": "img_045", "slide": 33, "caption": "Lecture 2: Building Systems (Simple Beam)"}, {"id": "img_046", "slide": 33, "caption": "Lecture 2: Building Systems (Simple Beam)"}, {"id": "img_047", "slide": 34, "caption": "Lecture 2: Building Systems (Simple Beam)"}, {"id": "img_048", "slide": 34, "caption": "Lecture 2: Building Systems (Simple Beam)"}, {"id": "img_049", "slide": 36, "caption": "Exercise 2: Simple Beam System — Choose and Design Building Roof system"}], "3": [{"id": "img_002", "slide": 2, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_003", "slide": 2, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_004", "slide": 2, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_005", "slide": 2, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_050", "slide": 3, "caption": "Lecture 3: Building Systems"}, {"id": "img_016", "slide": 3, "caption": "Lecture 3: Building Systems"}, {"id": "img_051", "slide": 4, "caption": "What is “Flat Slab System”? — Lecture 3: Building Systems"}, {"id": "img_052", "slide": 4, "caption": "What is “Flat Slab System”? — Lecture 3: Building Systems"}, {"id": "img_053", "slide": 4, "caption": "What is “Flat Slab System”? — Lecture 3: Building Systems"}, {"id": "img_054", "slide": 5, "caption": "What is “Flat Slab System”? — A reinforced concrete flat slab is a structural elem..."}, {"id": "img_055", "slide": 7, "caption": "Why we use “Flat Slab System”? — This design offers aesthetic and functional advan..."}, {"id": "img_056", "slide": 8, "caption": "Load Distribution of the system — 1- Slabs 2- Columns"}, {"id": "img_038", "slide": 10, "caption": "2-Structural members ( Columns) — Types of Loads on Columns Self-weight of the col..."}, {"id": "img_057", "slide": 12, "caption": "How is the Flat Slab System Constructed? — Drop panel"}, {"id": "img_058", "slide": 13, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_059", "slide": 13, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_060", "slide": 14, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_061", "slide": 14, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_049", "slide": 16, "caption": "Exercise 2: Simple Beam System — Choose and Design Building Roof system"}, {"id": "img_062", "slide": 19, "caption": "A two-way concrete flat plate is a structural system commonly used in building con..."}, {"id": "img_063", "slide": 20, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_064", "slide": 20, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_065", "slide": 21, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_066", "slide": 22, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_067", "slide": 22, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_068", "slide": 22, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_069", "slide": 23, "caption": "Punching shear Punching shear is a specific type of failure that can occur in rein..."}, {"id": "img_070", "slide": 24, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_071", "slide": 25, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_072", "slide": 26, "caption": "Height: 4”-14” | 10.2-35.6 cm Width: 10’-46’ | 3.05-14.02 m (Span) Length: 10’-46’..."}, {"id": "img_073", "slide": 27, "caption": "Dimensions & Sizes Two-Way Slab Concrete Floors are constructed in a range of size..."}, {"id": "img_074", "slide": 27, "caption": "Dimensions & Sizes Two-Way Slab Concrete Floors are constructed in a range of size..."}, {"id": "img_075", "slide": 27, "caption": "Dimensions & Sizes Two-Way Slab Concrete Floors are constructed in a range of size..."}, {"id": "img_076", "slide": 28, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_077", "slide": 29, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_078", "slide": 30, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_079", "slide": 31, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}, {"id": "img_080", "slide": 31, "caption": "تفاصيل وتنفيذ البلاطات اللاكمرية (Flat Slab)"}], "4": [{"id": "img_002", "slide": 2, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_003", "slide": 2, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_004", "slide": 2, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_005", "slide": 2, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_050", "slide": 3, "caption": "Lecture 4: Building Systems"}, {"id": "img_016", "slide": 3, "caption": "Lecture 4: Building Systems"}, {"id": "img_051", "slide": 4, "caption": "What is “Hollow Block System”? — Lecture 4: Building Systems"}, {"id": "img_081", "slide": 5, "caption": "What is “Hollow Block System”? — A hollow block system is a construction technique..."}, {"id": "img_082", "slide": 5, "caption": "What is “Hollow Block System”? — A hollow block system is a construction technique..."}, {"id": "img_083", "slide": 6, "caption": "Why we use “Hollow Block System”? — Reduced Weight: The hollow cores significantly..."}, {"id": "img_084", "slide": 6, "caption": "Why we use “Hollow Block System”? — Reduced Weight: The hollow cores significantly..."}, {"id": "img_085", "slide": 7, "caption": "Where we use “Hollow Block System”? — Lecture 4: Building Systems (Hollow Block Sy..."}, {"id": "img_056", "slide": 8, "caption": "Load Distribution of the system — 1- Slabs 2- Beams (hidden) 3- Columns"}, {"id": "img_086", "slide": 9, "caption": "1- Slabs  2- Beams (Hidden) — The Main Components of system"}, {"id": "img_087", "slide": 10, "caption": "1- Slabs  2- Beams (Hidden) — The Main Components of system"}, {"id": "img_088", "slide": 11, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_089", "slide": 12, "caption": "One Way Slab — Two Way Slab"}, {"id": "img_090", "slide": 12, "caption": "One Way Slab — Two Way Slab"}, {"id": "img_091", "slide": 13, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_092", "slide": 14, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_093", "slide": 15, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_038", "slide": 16, "caption": "3-Structural members ( Columns) — Types of Loads on Columns Self-weight of the col..."}, {"id": "img_094", "slide": 17, "caption": "How is the Flat Slab System Constructed? — Lecture 4: Building Systems (Hollow Blo..."}, {"id": "img_095", "slide": 17, "caption": "How is the Flat Slab System Constructed? — Lecture 4: Building Systems (Hollow Blo..."}, {"id": "img_096", "slide": 18, "caption": "How is the Hollow Block System Constructed? — Lecture 4: Building Systems (Hollow ..."}, {"id": "img_097", "slide": 18, "caption": "How is the Hollow Block System Constructed? — Lecture 4: Building Systems (Hollow ..."}, {"id": "img_098", "slide": 19, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_099", "slide": 19, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_100", "slide": 20, "caption": "How is the Hollow Block System Constructed? — Lecture 4: Building Systems (Hollow ..."}, {"id": "img_101", "slide": 20, "caption": "How is the Hollow Block System Constructed? — Lecture 4: Building Systems (Hollow ..."}, {"id": "img_102", "slide": 20, "caption": "How is the Hollow Block System Constructed? — Lecture 4: Building Systems (Hollow ..."}, {"id": "img_103", "slide": 20, "caption": "How is the Hollow Block System Constructed? — Lecture 4: Building Systems (Hollow ..."}, {"id": "img_104", "slide": 21, "caption": "Lecture 4: Building Systems (Hollow Block System) — Two Way Slab"}, {"id": "img_105", "slide": 21, "caption": "Lecture 4: Building Systems (Hollow Block System) — Two Way Slab"}, {"id": "img_106", "slide": 26, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_107", "slide": 27, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_108", "slide": 29, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_109", "slide": 29, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_110", "slide": 29, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}, {"id": "img_111", "slide": 29, "caption": "تفاصيل وتنفيذ السقف الهوردي (Hollow Block)"}], "5": [{"id": "img_002", "slide": 2, "caption": "أمثلة وتنفيذ البلاطات الشبكية (Waffle Slab)"}, {"id": "img_003", "slide": 2, "caption": "أمثلة وتنفيذ البلاطات الشبكية (Waffle Slab)"}, {"id": "img_004", "slide": 2, "caption": "أمثلة وتنفيذ البلاطات الشبكية (Waffle Slab)"}, {"id": "img_005", "slide": 2, "caption": "أمثلة وتنفيذ البلاطات الشبكية (Waffle Slab)"}, {"id": "img_050", "slide": 3, "caption": "Lecture 5: Building Systems"}, {"id": "img_016", "slide": 3, "caption": "Lecture 5: Building Systems"}, {"id": "img_051", "slide": 4, "caption": "What is “Waffle Slab System”? — Lecture 5: Building Systems"}, {"id": "img_112", "slide": 5, "caption": "What is “Waffle Slab System”? — A Waffle Slab system is a construction technique t..."}, {"id": "img_113", "slide": 5, "caption": "What is “Waffle Slab System”? — A Waffle Slab system is a construction technique t..."}, {"id": "img_114", "slide": 6, "caption": "Why we use “Waffle Slab System”? — Structural Strength: The grid design distribute..."}, {"id": "img_115", "slide": 8, "caption": "Load Distribution of the system — 1- Slabs 2- Beams (crossed Beams) 3- Columns"}, {"id": "img_116", "slide": 9, "caption": "1- Slabs  2- Beams (Crossed) — The Main Components of system"}, {"id": "img_117", "slide": 10, "caption": "A Waffle Slab is a two-way concrete slab reinforced by ribs in two directions . Wa..."}, {"id": "img_118", "slide": 11, "caption": "Lecture 5: Building Systems (Waffle Slab System) — A Waffle Slab is a two-way conc..."}, {"id": "img_119", "slide": 12, "caption": "Lecture 5: Building Systems (Waffle Slab System)"}, {"id": "img_120", "slide": 13, "caption": "Lecture 5: Building Systems (Waffle Slab System)"}, {"id": "img_121", "slide": 15, "caption": "Examples :  Free Education Unit - Ahungalla, Sri Lanka. — Section\u000b1: cross column ..."}, {"id": "img_122", "slide": 15, "caption": "Examples :  Free Education Unit - Ahungalla, Sri Lanka. — Section\u000b1: cross column ..."}, {"id": "img_123", "slide": 16, "caption": "Examples : This reinforced concrete building has a waffle slab system, Vancouver, ..."}, {"id": "img_124", "slide": 16, "caption": "Examples : This reinforced concrete building has a waffle slab system, Vancouver, ..."}, {"id": "img_125", "slide": 16, "caption": "Examples : This reinforced concrete building has a waffle slab system, Vancouver, ..."}, {"id": "img_126", "slide": 17, "caption": "Examples : This reinforced concrete building has a waffle slab system, Vancouver, ..."}, {"id": "img_127", "slide": 18, "caption": "Examples : This reinforced concrete building has a waffle slab system, Vancouver, ..."}, {"id": "img_128", "slide": 19, "caption": "Examples : This reinforced concrete building has a waffle slab system, Vancouver, ..."}, {"id": "img_129", "slide": 20, "caption": "Examples : — Lecture 5: Building Systems (Waffle Slab System)"}, {"id": "img_130", "slide": 21, "caption": "Examples : — Lecture 5: Building Systems (Waffle Slab System)"}, {"id": "img_131", "slide": 22, "caption": "Examples : — Lecture 5: Building Systems (Waffle Slab System)"}, {"id": "img_132", "slide": 23, "caption": "Examples : — Lecture 5: Building Systems (Waffle Slab System)"}, {"id": "img_038", "slide": 24, "caption": "3-Structural members ( Columns) — Types of Loads on Columns Self-weight of the col..."}], "6": [{"id": "img_002", "slide": 2, "caption": "تفاصيل ومساقط الكمرات المتقاطعة (Paneled Beam)"}, {"id": "img_003", "slide": 2, "caption": "تفاصيل ومساقط الكمرات المتقاطعة (Paneled Beam)"}, {"id": "img_004", "slide": 2, "caption": "تفاصيل ومساقط الكمرات المتقاطعة (Paneled Beam)"}, {"id": "img_005", "slide": 2, "caption": "تفاصيل ومساقط الكمرات المتقاطعة (Paneled Beam)"}, {"id": "img_051", "slide": 3, "caption": "What is “Paneled Beam System”? — Lecture 6: Building Systems"}, {"id": "img_133", "slide": 10, "caption": "Lecture 6: Building Systems (Paneled Beam System) — نظام الكمرات المتقاطعة :  هو ع..."}, {"id": "img_134", "slide": 10, "caption": "Lecture 6: Building Systems (Paneled Beam System) — نظام الكمرات المتقاطعة :  هو ع..."}, {"id": "img_135", "slide": 11, "caption": "Lecture 6: Building Systems (Paneled Beam System)"}, {"id": "img_136", "slide": 12, "caption": "Lecture 6: Building Systems (Paneled Beam System) — يعطي هذا النظام بحور تصل حتى 1..."}, {"id": "img_137", "slide": 14, "caption": "Lecture 6: Building Systems (Paneled Beam System) — Types of Paneled Beam System"}, {"id": "img_138", "slide": 14, "caption": "Lecture 6: Building Systems (Paneled Beam System) — Types of Paneled Beam System"}, {"id": "img_139", "slide": 15, "caption": "تفاصيل ومساقط الكمرات المتقاطعة (Paneled Beam)"}, {"id": "img_140", "slide": 16, "caption": "Examples : (مبنى قسم العمارة) .. جامعة أسيوط .. الدور الأرضى — Lecture 6: Building..."}, {"id": "img_141", "slide": 16, "caption": "Examples : (مبنى قسم العمارة) .. جامعة أسيوط .. الدور الأرضى — Lecture 6: Building..."}, {"id": "img_142", "slide": 17, "caption": "Lecture 6: Building Systems (Paneled Beam System) — Examples : (مبنى قسم العمارة) ..."}, {"id": "img_143", "slide": 18, "caption": "Lecture 6: Building Systems (Paneled Beam System) — Examples : (مبنى قسم العمارة) ..."}], "7": [{"id": "img_002", "slide": 2, "caption": "أمثلة وتفاصيل الإطارات الخرسانية (Concrete Frames)"}, {"id": "img_003", "slide": 2, "caption": "أمثلة وتفاصيل الإطارات الخرسانية (Concrete Frames)"}, {"id": "img_004", "slide": 2, "caption": "أمثلة وتفاصيل الإطارات الخرسانية (Concrete Frames)"}, {"id": "img_005", "slide": 2, "caption": "أمثلة وتفاصيل الإطارات الخرسانية (Concrete Frames)"}, {"id": "img_051", "slide": 3, "caption": "What is “Concrete Frames System”? — Lecture 7: Building Systems"}, {"id": "img_144", "slide": 8, "caption": "هي التطوير الإنشائي لفكرة العمود والكمرة .. ففي الإطارات وبفعل نظرية الاستمرارية ا..."}, {"id": "img_145", "slide": 8, "caption": "هي التطوير الإنشائي لفكرة العمود والكمرة .. ففي الإطارات وبفعل نظرية الاستمرارية ا..."}, {"id": "img_146", "slide": 8, "caption": "هي التطوير الإنشائي لفكرة العمود والكمرة .. ففي الإطارات وبفعل نظرية الاستمرارية ا..."}, {"id": "img_147", "slide": 9, "caption": "الإطارات الخطية Linear Frames  ذات البحور الواسعة والكمرات الأفقية تتعرض أضلاعها ا..."}, {"id": "img_148", "slide": 10, "caption": "أمثلة وتفاصيل الإطارات الخرسانية (Concrete Frames)"}, {"id": "img_149", "slide": 11, "caption": "أمثلة وتفاصيل الإطارات الخرسانية (Concrete Frames)"}, {"id": "img_150", "slide": 12, "caption": "هناك حرية عالية في تكوين هيئة المبنى سواء من كتلة صريحة أو مجموعة كتل مركبة."}, {"id": "img_151", "slide": 12, "caption": "هناك حرية عالية في تكوين هيئة المبنى سواء من كتلة صريحة أو مجموعة كتل مركبة."}, {"id": "img_152", "slide": 13, "caption": "Lecture 7: Building Systems (Concrete Frames System)"}, {"id": "img_153", "slide": 13, "caption": "Lecture 7: Building Systems (Concrete Frames System)"}, {"id": "img_154", "slide": 14, "caption": "الإطارات المنحنية Curvilinear Frames مشكلة التحميل هنا تظهر عند التقاء الهيكل بالأ..."}, {"id": "img_155", "slide": 15, "caption": "الفرنديل Vierendeel Girders هو نوع من الإطارات يتيح فكرة حذف نقاط الارتكاز في المب..."}, {"id": "img_156", "slide": 15, "caption": "الفرنديل Vierendeel Girders هو نوع من الإطارات يتيح فكرة حذف نقاط الارتكاز في المب..."}, {"id": "img_157", "slide": 16, "caption": "الفرنديل Vierendeel Girders هو نوع من الإطارات يتيح فكرة حذف نقاط الارتكاز في المب..."}, {"id": "img_158", "slide": 17, "caption": "Simple Concrete Frame — Span: 12-22 M Spacing : 4-6 M Main Girder : L/14  Width of..."}, {"id": "img_159", "slide": 18, "caption": "Simple Concrete Frame"}, {"id": "img_160", "slide": 19, "caption": "Simple Concrete Frame — EXAMPLE"}, {"id": "img_161", "slide": 20, "caption": "Vodafone / be baumschlager eberle — The precisely articulated frame with its sturd..."}, {"id": "img_162", "slide": 21, "caption": "Vodafone / be baumschlager eberle — The precisely articulated frame with its sturd..."}, {"id": "img_163", "slide": 22, "caption": "أمثلة وتفاصيل الإطارات الخرسانية (Concrete Frames)"}, {"id": "img_137", "slide": 24, "caption": "Lecture 7: Building Systems (Concrete Frames System) — Types of Concrete Frames Sy..."}, {"id": "img_138", "slide": 24, "caption": "Lecture 7: Building Systems (Concrete Frames System) — Types of Concrete Frames Sy..."}, {"id": "img_164", "slide": 27, "caption": "Innovation, Learning and Competitiveness Unit (UIAC) of the Ibero-American Univers..."}, {"id": "img_165", "slide": 27, "caption": "Innovation, Learning and Competitiveness Unit (UIAC) of the Ibero-American Univers..."}, {"id": "img_166", "slide": 28, "caption": "Innovation, Learning and Competitiveness Unit (UIAC) of the Ibero-American Univers..."}, {"id": "img_167", "slide": 28, "caption": "Innovation, Learning and Competitiveness Unit (UIAC) of the Ibero-American Univers..."}, {"id": "img_168", "slide": 29, "caption": "أمثلة وتفاصيل الإطارات الخرسانية (Concrete Frames)"}, {"id": "img_169", "slide": 30, "caption": "EXAMPLE"}, {"id": "img_170", "slide": 30, "caption": "EXAMPLE"}]};
  const LECTURE_THUMBS = {"1": "img_002", "2": "img_002", "3": "img_004", "4": "img_004", "5": "img_004", "6": "img_004", "7": "img_004"};
  const TOTAL_ORIGINAL_IMAGES = 170;

  const LECTURES = [
    {
      id: 1,
      num: '01',
      titleAr: 'مقدمة وأحمال المباني الإنشائية',
      titleEn: 'Introduction & Structural Loads',
      spanBadge: 'أساسيات المنهج',
      color: '#13294b',
      summary: 'تعريف تشييد المباني، محتويات المقرر، تصنيف الأحمال والتأثيرات الإنشائية الـ 12، حساب الأحمال الميتة لطبقات الأرضية، أحمال الرياح، وجدول الأحمال الحية حسب الإشغال.'
    },
    {
      id: 2,
      num: '02',
      titleAr: 'نظام الكمرات البسيطة (البلاطات المصمتة)',
      titleEn: 'Simple Beam System (Solid Slab)',
      spanBadge: 'بحور 3 – 6 م',
      color: '#2c6a96',
      summary: 'مسار انتقال الأحمال (بلاطة ← كمرة ← عمود ← قاعدة)، البلاطات ذات الاتجاه الواحد والاتجاهين، أنواع الكمرات والأعمدة، مراحل التنفيذ والشدات والتسليح.'
    },
    {
      id: 3,
      num: '03',
      titleAr: 'نظام البلاطات اللاكمرية (فلات سلاب)',
      titleEn: 'Flat Slab System',
      spanBadge: 'بحور 3 – 14.3 م',
      color: '#a8822f',
      summary: 'البلاطات المسطحة بدون كمرات، الأنواع الأربعة (مسطحة، بسقوط، بتاج عمود، بكليهما)، ظاهرة القص الثاقب (Punching Shear)، ومقارنة الارتفاع الصافي.'
    },
    {
      id: 4,
      num: '04',
      titleAr: 'نظام البلوكات المفرغة (السقف الهوردي)',
      titleEn: 'Hollow Block System',
      spanBadge: 'بحور 5 – 9 م',
      color: '#b5583a',
      summary: 'الأعصاب والبلوكات المفرغة والجزء المصمت، الكمرات الساقطة والمدفونة، اشتراطات الكود للأبعاد، ومقارنة البلوك الأسمنتي والفخاري والفلين في السوق المصري.'
    },
    {
      id: 5,
      num: '05',
      titleAr: 'نظام البلاطات الشبكية (وافل سلاب)',
      titleEn: 'Waffle Slab System',
      spanBadge: 'بحور 7 – 24.4 م',
      color: '#3d5a80',
      summary: 'شبكة الأعصاب المتعامدة للبحور الكبيرة، وحدات القوالب (48، 60، 76، 90 سم)، المنطقة المصمتة فوق الأعمدة، ومعادلة العمق Span/24 مع أمثلة عالمية.'
    },
    {
      id: 6,
      num: '06',
      titleAr: 'نظام الكمرات المتقاطعة (بانلد بيم)',
      titleEn: 'Paneled Beam System',
      spanBadge: 'حتى 12 م · 80–150 م²',
      color: '#2f5d50',
      summary: 'العمل الشبكي للكمرات المتقاطعة (Grid Action)، المسافات المفضلة 2–5 م، نسبة الأبعاد 4/3، حساب قطاعات الكمرات الرئيسية والداخلية، ومثال قسم العمارة بأسيوط.'
    },
    {
      id: 7,
      num: '07',
      titleAr: 'نظام الإطارات الخرسانية (فريمز)',
      titleEn: 'Concrete Frames System',
      spanBadge: 'بحور 12 – 40 م',
      color: '#4a5465',
      summary: 'نظرية الاستمرارية بين العمود والكمرة، الإطارات الخطية ومتعددة الأضلاع والمنحنية، كمرات فرنديل (Vierendeel)، وحالات الثبات للوصلات المفصلية والثابتة.'
    }
  ];

  const STRUCTURAL_LOADS = [
    { id: 'udl', nameEn: 'Uniformly Distributed Load (UDL)', nameAr: 'حمل موزع بانتظام', cat: 'توزيع', desc: 'حمل يتوزع بالتساوي على طول الكمرة أو مساحة البلاطة مثل وزن البلاطة الذاتي وأحمال التشطيبات.', svgType: 'udl' },
    { id: 'point', nameEn: 'Point Load', nameAr: 'حمل نقطي (مركز)', cat: 'توزيع', desc: 'حمل يتركز في نقطة محددة على الكمرة، مثل ارتكاز عمود مزروع أو كمرة ثانوية على كمرة رئيسية.', svgType: 'point' },
    { id: 'concentrated', nameEn: 'Concentrated Load', nameAr: 'حمل مركز ذو مساحة محدودة', cat: 'توزيع', desc: 'حمل يؤثر في موضع محدد ولكن قد يكون له حجم أو شكل هندسي محدود مثل قاعدة ماكينة ثقيلة.', svgType: 'point' },
    { id: 'moment', nameEn: 'Moment Load', nameAr: 'حمل عزم الانحناء', cat: 'أثر داخلي', desc: 'حمل يؤثر لإحداث عزوم انحناء (Bending Moments) داخل الكمرة مثل تأثير الكوابيل المتصلة.', svgType: 'moment' },
    { id: 'torsional', nameEn: 'Torsional Load', nameAr: 'حمل الليّ (الالتواء)', cat: 'أثر داخلي', desc: 'حمل يسبب التفافاً أو التواءً (Twisting / Torsion) حول المحور الطولي للكمرة مثل كمرات الشرفات الجانبية.', svgType: 'torsion' },
    { id: 'shear', nameEn: 'Shear Load', nameAr: 'حمل القص', cat: 'أثر داخلي', desc: 'حمل يولّد قوى قص عمودية على المحور الطولي للكمرة، وتبلغ أقصاها عادةً عند الركائز.', svgType: 'shear' },
    { id: 'axial', nameEn: 'Axial Load', nameAr: 'حمل محوري', cat: 'أثر داخلي', desc: 'حمل يعمل على طول المحور الرئيسي للعنصر مسبباً ضغطاً (Compression) كالأعمدة أو شداً (Tension).', svgType: 'axial' },
    { id: 'temp', nameEn: 'Temperature Load', nameAr: 'حمل حراري', cat: 'بيئي', desc: 'إجهادات ناتجة عن التمدد أو الانكماش الحراري للعناصر الإنشائية بسبب تغير درجات الحرارة.', svgType: 'temp' },
    { id: 'wind', nameEn: 'Wind Load', nameAr: 'حمل الرياح', cat: 'بيئي', desc: 'حمل جانبي أو ضغط/سحب يؤثر على الواجهات والأسقف نتيجة ضغط الرياح ويعتمد على ارتفاع المبنى وشكله وموقعه.', svgType: 'wind' },
    { id: 'live', nameEn: 'Live Load', nameAr: 'الحمل الحي', cat: 'تشغيلي', desc: 'حمل متغير أو متحرك ناتج عن الإشغال وحركة الأفراد والأثاث والمعدات المؤقتة والصدمات.', svgType: 'udl' },
    { id: 'dead', nameEn: 'Dead Load', nameAr: 'الحمل الميت', cat: 'دائم', desc: 'حمل دائم وثابت ناتج عن الوزن الذاتي للهيكل الإنشائي وكافة العناصر المثبتة بشكل دائم كالأرضيات والحوائط.', svgType: 'udl' },
    { id: 'dynamic', nameEn: 'Dynamic Load', nameAr: 'حمل ديناميكي', cat: 'تشغيلي', desc: 'حمل يتغير في مقداره أو اتجاهه مع الزمن مثل الاهتزازات أو حركة المركبات أو الزلازل.', svgType: 'dynamic' }
  ];

  const DEFAULT_DEAD_LAYERS = [
    { nameAr: 'بلاطة خرسانية (Concrete slab)', thickness: 200, density: 2400, slideLoad: 4.71 },
    { nameAr: 'طبقة عزل (Insulation)', thickness: 200, density: 42, slideLoad: 0.08 },
    { nameAr: 'لياسة بيرلايت (Perlite screed)', thickness: 200, density: 1000, slideLoad: 1.96 },
    { nameAr: 'تشطيب الأرضية (Floor finish)', thickness: 15, density: 660, slideLoad: 0.10 }
  ];

  const LIVE_LOADS_TABLE = [
    { cat: 'سكني', groupEn: 'Residential dwellings, apartments, hotels', spaceEn: 'Private rooms and corridors serving them', spaceAr: 'الغرف الخاصة والممرات الخادمة لها', uniform: '40 (1.92)', conc: '—', kn: 1.92 },
    { cat: 'سكني', groupEn: 'Residential dwellings, apartments, hotels', spaceEn: 'Public rooms and corridors serving them', spaceAr: 'القاعات العامة والممرات الخادمة لها', uniform: '100 (4.79)', conc: '—', kn: 4.79 },
    { cat: 'مستشفيات', groupEn: 'Hospitals', spaceEn: 'Patient rooms', spaceAr: 'غرف المرضى', uniform: '40 (1.92)', conc: '1,000 (4.45)', kn: 1.92 },
    { cat: 'مستشفيات', groupEn: 'Hospitals', spaceEn: 'Operating rooms, laboratories', spaceAr: 'غرف العمليات والمختبرات', uniform: '60 (2.87)', conc: '1,000 (4.45)', kn: 2.87 },
    { cat: 'مستشفيات', groupEn: 'Hospitals', spaceEn: 'Corridors above first floor', spaceAr: 'الممرات فوق الدور الأرضي', uniform: '80 (3.83)', conc: '1,000 (4.45)', kn: 3.83 },
    { cat: 'مكاتب', groupEn: 'Office buildings', spaceEn: 'Lobbies and first floor corridors', spaceAr: 'الأبهية وممرات الدور الأرضي', uniform: '100 (4.79)', conc: '2,000 (8.90)', kn: 4.79 },
    { cat: 'مكاتب', groupEn: 'Office buildings', spaceEn: 'Offices', spaceAr: 'المكاتب الإدارية', uniform: '50 (2.40)', conc: '2,000 (8.90)', kn: 2.40 },
    { cat: 'مكاتب', groupEn: 'Office buildings', spaceEn: 'Corridors above first floor', spaceAr: 'الممرات فوق الدور الأرضي', uniform: '80 (3.83)', conc: '2,000 (8.90)', kn: 3.83 },
    { cat: 'ترفيهي', groupEn: 'Recreational uses', spaceEn: 'Bowling alleys, poolrooms, and similar uses', spaceAr: 'صالات البولينج والبلياردو وما شابهها', uniform: '75 (3.59)', conc: '—', kn: 3.59 },
    { cat: 'ترفيهي', groupEn: 'Recreational uses', spaceEn: 'Dance halls and ballrooms, gymnasiums', spaceAr: 'قاعات الرقص والاحتفالات والصالات الرياضية', uniform: '100 (4.79)', conc: '—', kn: 4.79 },
    { cat: 'ترفيهي', groupEn: 'Recreational uses', spaceEn: 'Stadiums and arenas with fixed seats', spaceAr: 'الملاعب والمدرجات ذات المقاعد الثابتة', uniform: '60 (2.87)', conc: '—', kn: 2.87 },
    { cat: 'تجاري', groupEn: 'Stores (Retail)', spaceEn: 'Retail — First floor', spaceAr: 'محلات التجزئة — الدور الأرضي', uniform: '100 (4.79)', conc: '1,000 (4.45)', kn: 4.79 },
    { cat: 'تجاري', groupEn: 'Stores (Retail)', spaceEn: 'Retail — Upper floors', spaceAr: 'محلات التجزئة — الأدوار العليا', uniform: '75 (3.59)', conc: '1,000 (4.45)', kn: 3.59 },
    { cat: 'تجاري', groupEn: 'Stores (Wholesale)', spaceEn: 'Wholesale, all floors', spaceAr: 'متاجر الجملة — جميع الأدوار', uniform: '125 (6.00)', conc: '1,000 (4.45)', kn: 6.00 },
    { cat: 'مخازن', groupEn: 'Storage warehouses', spaceEn: 'Light storage', spaceAr: 'مخازن خفيفة', uniform: '125 (6.00)', conc: '—', kn: 6.00 },
    { cat: 'مخازن', groupEn: 'Storage warehouses', spaceEn: 'Heavy storage', spaceAr: 'مخازن ثقيلة', uniform: '250 (11.97)', conc: '—', kn: 11.97 },
    { cat: 'صناعي', groupEn: 'Manufacturing', spaceEn: 'Light manufacturing', spaceAr: 'صناعات خفيفة', uniform: '125 (6.00)', conc: '2,000 (8.90)', kn: 6.00 },
    { cat: 'صناعي', groupEn: 'Manufacturing', spaceEn: 'Heavy manufacturing', spaceAr: 'صناعات ثقيلة', uniform: '250 (11.97)', conc: '3,000 (13.40)', kn: 11.97 },
    { cat: 'مدارس', groupEn: 'Schools', spaceEn: 'Classrooms', spaceAr: 'الفصول الدراسية', uniform: '40 (1.92)', conc: '1,000 (4.45)', kn: 1.92 },
    { cat: 'مدارس', groupEn: 'Schools', spaceEn: 'Corridors above first floor', spaceAr: 'الممرات فوق الدور الأرضي', uniform: '80 (3.83)', conc: '1,000 (4.45)', kn: 3.83 },
    { cat: 'مدارس', groupEn: 'Schools', spaceEn: 'First floor corridors', spaceAr: 'ممرات الدور الأرضي', uniform: '100 (4.79)', conc: '1,000 (4.45)', kn: 4.79 }
  ];

  const HB_BLOCKS = [
    { id: 'c15', nameAr: 'بلوك أسمنتي 15 سم', dims: '400×200×150 مم', oneWay: 3.03, twoWay: 3.36, weightKg: '12–15 كجم', material: 'أسمنتي', pros: 'صلب ومتين ويقاوم الأحمال الثقيلة والعوامل الجوية.', cons: 'وزن أثقل نسبياً ويزيد الحمل الميت على الهيكل.' },
    { id: 'c20', nameAr: 'بلوك أسمنتي 20 سم', dims: '400×200×200 مم', oneWay: 3.30, twoWay: 3.80, weightKg: '15–18 كجم', material: 'أسمنتي', pros: 'الأكثر شيوعاً للبحور المتوسطة، وزن ذاتي للبلوك ~2.7 kN/m².', cons: 'يزيد الحمل الميت مقارنة بالفخاري والفلين.' },
    { id: 'c25', nameAr: 'بلوك أسمنتي 25 سم', dims: '400×200×250 مم', oneWay: 4.10, twoWay: 4.78, weightKg: '18–20 كجم', material: 'أسمنتي', pros: 'يعطي سمكاً كلياً كبيراً (30–32 سم) لمقاومة الترخيم في البحور الأكبر.', cons: 'الأثقل وزناً بين البلوكات الأسمنتية.' },
    { id: 'foam', nameAr: 'بلوك فلين / بوليسترين', dims: '500×400×200 مم', oneWay: 0.70, twoWay: 1.20, weightKg: '2–4 كجم', material: 'بوليسترين', pros: 'خفيف جداً (0.16 kN/m²)، عازل حراري وصوتي ممتاز، يقلل الحمل الميت.', cons: 'لا يحمل أحمالاً مباشرة ويتطلب تثبيتاً جيداً قبل الصب مع مونة 20–30 مم.' }
  ];

  const LECTURE_TABS_DATA = {
    1: {
      adv: [
        'توحيد منهجية تصميم وتنفيذ المباني عبر 4 مراحل متكاملة: التصميم، التخطيط، توريد المواد، والتنفيذ.',
        'تحقيق التوازن بين الكفاءة الوظيفية والجمالية للمنشآت السكنية والتجارية ومشاريع البنية التحتية.',
        'التحليل الدقيق لأنواع الأحمال والتأثيرات الـ 12 مع معاملات الأمان وتركيبات الأحمال (مثل 1.4 D + 1.6 L) يسهم في أمان المنشأ ومنع الانهيار أو الترخيم المفرط.'
      ],
      dis: [
        'إغفال الأحمال البيئية (الرياح والحرارة) أو الديناميكية يؤدي إلى شروخ أو إجهادات غير محسوبة.',
        'الخلط بين الحمل الميت الدائم والحمل الحي المتغير يسبب أخطاء في تقدير قطاعات العناصر الإنشائية.',
        'اختلاف أحمال الإشغال بشكل كبير (من 1.92 kN/m² في السكني إلى 11.97 kN/m² في المخازن الثقيلة) يتطلب دقة عالية.'
      ],
      uses: [
        'المباني السكنية: المنازل، الشقق، الفنادق (غرف خاصة 1.92 kN/m²، قاعات عامة 4.79 kN/m²).',
        'المباني التجارية والخدمية: المكاتب (2.40)، المدارس (1.92)، المستشفيات (1.92–3.83)، المتاجر (3.59–6.00).',
        'المنشآت الصناعية والمخازن (6.00–11.97 kN/m²) ومشاريع البنية التحتية (طرق، كباري، أنفاق، سدود، مطارات).'
      ],
      specs: [
        'الأحمال والتأثيرات الـ 12 (العزم والقص والليّ والمحوري آثار داخلية تنشأ عن الأحمال): UDL، نقطي، مركز، عزم، التواء، قص، محوري، حراري، رياح، حي، ميت، وديناميكي.',
        'مثال الحمل الميت لطبقات الأرضية: بلاطة 200 مم (4.71) + عزل 200 مم (0.08) + بيرلايت 200 مم (1.96) + تشطيب 15 مم (0.10) = 6.85 kN/m².',
        'عوامل أحمال الرياح على الأسقف والواجهات: ارتفاع المبنى، الشكل الهندسي، الموقع، واتجاه الرياح.'
      ]
    },
    2: {
      adv: [
        'سهولة التصميم والتنفيذ وتوافر الخبرة الفنية والمواد في معظم مواقع البناء.',
        'مرونة عالية في مقاومة مختلف أنواع الأحمال (ميتة وحية) وتوزيعها بوضوح عبر مسار مباشر.',
        'الكمرات المستمرة (Continuous) أكثر اقتصادية مقارنة بالكمرات بسيطة الارتكاز لتقليل العزم الموجب.'
      ],
      dis: [
        'سقوط الكمرات أسفل السقف يقلل الارتفاع الصافي للفراغ ويعيق أحياناً مسارات التكييف والكهرباء.',
        'محدودية البحور الاقتصادية (عادة 3–6 م للبلاطات المصمتة) مقارنة بالأنظمة الحديثة للبحور الكبيرة.',
        'تقيد الحرية المعمارية في تعديل أماكن القواطيع والحوائط الداخلية مستقبلاً.'
      ],
      uses: [
        'المباني السكنية التقليدية (غرف النوم، المعيشة، الشقق) ببحور صغيرة ومتوسطة مثل 5×3 م و 6×4 م.',
        'الأسقف والأرضيات للمباني الإدارية الصغيرة والمدارس ذات التوزيع المنتظم للأعمدة.',
        'الكباري البسيطة والمنشآت الهيكلية الخرسانية ذات الغرف المقسمة بحوائط ثابتة.'
      ],
      specs: [
        'مسار الأحمال: 1. البلاطات (Slabs) ← 2. الكمرات (Beams) ← 3. الأعمدة (Columns) ← 4. القواعد (Footings).',
        'تصنيف البلاطات: اتجاه واحد One-Way إذا كان b/a ≥ 2، واتجاهين Two-Way إذا كان b/a < 2.',
        'علاقة الكمرة بالحائط b ≥ t؛ الكابولي يتطلب تسليح شوكة يمتد للداخل 1.5 Lc؛ العمود أخطر عنصر ويعمل بالضغط.'
      ]
    },
    3: {
      adv: [
        'سقف أملس خالٍ من الكمرات الساقطة يمنح حرية معمارية كاملة في تقسيم الفراغات الداخلية.',
        'توفير في ارتفاع الدور الإجمالي (3.2 م بدلاً من 3.4 م لنفس الارتفاع الصافي 2.8 م).',
        'سرعة التنفيذ وتبسيط الشدة الخشبية وسهولة تمديد خدمات الإضاءة والتكييف (HVAC).'
      ],
      dis: [
        'خطر الانهيار بالقص الثاقب (Punching Shear) حول الأعمدة عند تركز الأحمال.',
        'زيادة سمك البلاطة والوزن الذاتي وتكلفة الحديد مقارنة بالبلاطات المصمتة في البحور الصغيرة.',
        'تحتاج إلى سقوط بلاطة (Drop Panel) أو تاج عمود (Column Capital) عند زيادة الأحمال أو البحور.'
      ],
      uses: [
        'الشقق السكنية الحديثة التي تتطلب مرونة في تعديل القواطيع الداخلية دون التزام بمسار الكمرات.',
        'المباني الإدارية والمكاتب المفتوحة (Open Plan Offices) والمراكز التجارية الخفيفة.',
        'المباني التي تتطلب أقصى ارتفاع صافي ممكن.'
      ],
      specs: [
        'الأنواع الأربعة: مسطحة (Flat Plate)، بسقوط (Drop Panel)، بتاج عمود (Column Capital)، وبكليهما.',
        'Flat Plate: بحر تقليدي 3.05–12.19 م (PT حتى 14.33 م)، السمك = Span/33 (12.7–35.6 سم)، عمود 30.5–81.3 سم.',
        'Flat Slab بسقوط: بحر 3.05–12.19 م (PT حتى 14.02 م)، السمك = Span/36، عرض السقوط ≥ L/3 وسمكه 0.25×سمك البلاطة.'
      ]
    },
    4: {
      adv: [
        'تخفيف الوزن الميت للسقف بفضل الفراغات المجوفة مما يقلل الأحمال على الأعمدة والأساسات.',
        'عزل حراري وصوتي ممتاز بفضل الفراغات الهوائية أو بلوكات الفلين (البوليسترين).',
        'اقتصادي في استهلاك الخرسانة، سهل وسريع التنفيذ لطبيعته الوحداتية، ومقاوم للحريق نسبياً في البلوك الأسمنتي والفخاري (أما بلوك البوليسترين فقابل للاشتعال)، مع إمكانية استخدام كمرات مدفونة.'
      ],
      dis: [
        'البلوك الأسمنتي ثقيل نسبياً مقارنة بالفلين، بينما الفلين لا يتحمل أحمالاً مباشرة ويجب تثبيته جيداً قبل الصب.',
        'ضرورة عكس آخر بلوك في الصف لمنع تسرب الخرسانة داخل التجاويف أثناء الصب.',
        'ضعف مقاومة القص قرب الركائز مما يفرض تنفيذ جزء مصمت (Solid Part X ≥ 150 mm).'
      ],
      uses: [
        'الصالات المتوسطة والواسعة نسبياً (مثل صالة 7×9 م) في المباني السكنية والفلل.',
        'المباني التعليمية والإدارية التي تتطلب أسقفاً مستوية (مع الكمرات المخفية) وعزلاً صوتياً وحرارياً جيداً.',
        'المباني في المناطق الحارة لتقليل انتقال الحرارة عبر الأسقف وتقليل وزن الهيكل.'
      ],
      specs: [
        'اشتراطات الكود: e ≤ 700 مم (العملي 400 مم)، عرض العصب b ≥ max(100 مم, t/3) (العملي 100 مم)، S = e + b = 500 مم.',
        'بلاطة التغطية ts ≥ max(50 مم, e/10) (العملي 50–70 مم)، ارتفاع البلوك h = 150/200/250 مم، الجزء المصمت X ≥ 150 مم.',
        'بلوكات السوق المصري: أسمنتي (3.03–4.78 kN/m²، 12–20 كجم)، فخاري (8–15 كجم)، فلين (0.70–1.20 kN/m²، 2–4 كجم).'
      ]
    },
    5: {
      adv: [
        'قدرة عالية على تغطية بحور كبيرة وأحمال ثقيلة مع تقليل الترخيم (Deflection) بفضل الصلابة العالية.',
        'توفير كبير في كمية الخرسانة والحديد وخفض الوزن الذاتي مما يوفر في تكلفة الأساسات.',
        'شكل معماري مميز للسقف المكشوف مع إمكانية استغلال التجاويف لتركيب الإضاءة والخدمات والعزل الصوتي.'
      ],
      dis: [
        'تكلفة وتعقيد الشدات والقوالب الخاصة (Domes / Pans) وتطلب دقة عالية في رصها وفكها.',
        'زيادة السمك الإنشائي الكلي للسقف (Span/24) مما قد يزيد ارتفاع المبنى.',
        'ضرورة إزالة القوالب حول الأعمدة لتكوين رأس مصمت (Solid Head) لمقاومة القص الثاقب.'
      ],
      uses: [
        'القاعات الكبرى والمسارح والمدرجات (Auditoriums) التي تتطلب فراغات واسعة خالية من الأعمدة.',
        'الجراجات متعددة الطوابق (Parking Garages) والصالات الرياضية والمباني العامة (مثل صالة 10×14 م).',
        'المباني المؤسسية والجامعية ذات الأسقف الخرسانية المكشوفة (مثل Free Education Unit بسريلانكا ومبنى فانكوفر بكندا).'
      ],
      specs: [
        'مدى البحور: تقليدي 7.62–16.76 م (7–16 م)، وبنظام الشد اللاحق (Post-Tensioned) 9.14–24.38 م.',
        'عمق البلاطة: Span/24 (من 25.4 إلى 73.7 سم أو عملياً 20–50 سم)، وارتفاع الدور 3.05–4.88 م.',
        'وحدات القوالب (Modules/Domes): 48×48، 60×60، 76×76، 90×90 سم؛ عرض الأعصاب 12.5–15 سم؛ الأعمدة 61–101.6 سم.'
      ]
    },
    6: {
      adv: [
        'توزيع كفء للأحمال عبر شبكة متقاطعة (Grid Action) مما يقلل الإجهادات على كل كمرة منفردة.',
        'اقتصادي للبحور الكبيرة والمساحات المفتوحة (80–150 م² بدون أعمدة داخلية) مع استخدام بلاطات أرق.',
        'ثبات إنشائي عالٍ لمقاومة الانحناء والالتواء والقص، وتوفير فراغات بين الكمرات لتمرير الخدمات.'
      ],
      dis: [
        'تعقيد التنفيذ والشدات الخشبية وحاجة التقاطعات إلى دقة عالية في ضبط استقامة الكمرات والتسليح.',
        'زيادة عمق الكمرات يقلل الارتفاع الصافي للسقف ويزيد الوزن الذاتي المؤثر على الأساسات.',
        'يُفضَّل تجنب وضع حوائط على الكمرات الداخلية ما لم تُصمَّم الكمرة لتحمل وزنها، وتحتاج الكمرات المكشوفة لصيانة في البيئات المسببة للتآكل.'
      ],
      uses: [
        'المدرجات الجامعية، استوديوهات التصميم المعماري، وقاعات العرض (مثل مبنى قسم العمارة بجامعة أسيوط).',
        'القاعات الكبرى متعددة الأغراض والمعارض بمساحات 80–150 م² (مثل صالة 10×15 م).',
        'الصالات الأوسع من ذلك عند استخدام الإطارات المتقاطعة (Paneled Frames) أو الكمرات المائلة (Skew 45°)، وتحتاج دراسة إنشائية خاصة لتحديد المساحة المناسبة.'
      ],
      specs: [
        'البحور حتى 12 م (بسيط)، المسافات بين الكمرات الداخلية a, b من 2.0 إلى 5.0 م، ونسبة الطولين ≤ 4/3.',
        'الكمرة الخارجية الرئيسية (B3, B4): العرض 250–300 مم والعمق = Ls/16 (يقرب بالزيادة لأقرب 50 مم).',
        'الكمرة الداخلية (B1, B2): العرض 150–250 مم والعمق = Ls/24 (يقرب لأقرب 50 مم)؛ سمك البلاطة = Ls/(35–45).'
      ]
    },
    7: {
      adv: [
        'الاستمرارية المادية والهندسية بين العمود والكمرة (Monolithic Rigid Joints) تتيح تغطية بحور كبيرة (15–40 م بالخرسانة المسلحة العادية، وأكثر من ذلك بالشد اللاحق أو بمنشآت خاصة).',
        'مقاومة ممتازة للأحمال الرأسية والجانبية (الرياح والزلازل) كإطار مقاوم للعزوم (Moment-Resisting Frame).',
        'حرية معمارية عالية في تشكيل الكتل الصريحة والمركبة، وإمكانية حذف أعمدة الدور الأرضي عبر كمرات فرنديل.'
      ],
      dis: [
        'تعقيد تصميم وتنفيذ وصلات الأركان شديدة التسليح وصعوبة الشدات الخشبية وتكلفتها العالية.',
        'عمق الكمرات الرئيسية الكبير (L/14–16) يقلل الارتفاع الصافي ويزيد الوزن الذاتي على الأساسات.',
        'تحتاج الإطارات إلى مدادات وبلاطات ثانوية لتغليف الفراغ، وتتعرض الإطارات الخطية لعزوم انحناء عالية.'
      ],
      uses: [
        'المصانع، المخازن الكبرى، الصالات الرياضية وحمامات السباحة، وهناجر الطائرات (مثل صالة 12×18 م).',
        'المباني الجامعية والمراكز الثقافية (مثل UIAC بجامعة ليون الإيبيرية ومبنى Vodafone لـ Baumschlager Eberle).',
        'المباني متعددة الطوابق التي تتطلب دوراً أرضياً مفتوحاً بلا أعمدة باستخدام كمرات فرنديل (Vierendeel Girders).'
      ],
      specs: [
        'الإطار الخرساني البسيط: بحور 12–22 م (والإطارات الخاصة 15–40 م، وما فوقها بالشد اللاحق أو بمنشآت خاصة)، التباعد بين الإطارات 4–6 م.',
        'الكمرة الرئيسية (Main Girder): العمق t = L/(14–16) والعرض 30–40 سم؛ الكمرات الثانوية بعمق Spacing/10 وتباعد 3–5 م.',
        'الأنواع: خطية (Linear)، متعددة الأضلاع (Polygonal)، منحنية/عقود (Curvilinear)، وفرنديل (Vierendeel)؛ ربط الأساسات بسملات.'
      ]
    }
  };

  const QUIZ_QUESTIONS = [
    // ==================== LECTURE 1 (10 Questions) ====================
    { id: 101, lec: 1, cat: 'المواصفات', q: 'ما المراحل الأربع الأساسية التي تشملها عملية تشييد المباني (Building Construction) وفقاً للمحاضرة الأولى؟', opts: ['التصميم، التخطيط، توريد المواد، والتنفيذ', 'الحفر، الصب، التشطيب، والبيع', 'المساحة، التسليح، العزل، والصيانة', 'التحليل الإنشائي، النمذجة، الطلاء، والتأثيث'], ans: 0, exp: 'تشمل عملية البناء أربع مراحل رئيسية هي: التصميم (Designing)، التخطيط (Planning)، توريد المواد (Procurement)، والتنفيذ (Execution).' },
    { id: 102, lec: 1, cat: 'الاستخدامات', q: 'أي من المجموعات التالية تمثل النطاق الكامل لمشاريع تشييد المباني كما ورد في المحاضرة الأولى؟', opts: ['المباني السكنية فقط', 'المباني السكنية والتجارية فقط', 'المباني السكنية والتجارية ومشاريع البنية التحتية كالطرق والكباري والمطارات', 'الكباري والأنفاق والسدود فقط'], ans: 2, exp: 'تمتد مشاريع التشييد من المباني السكنية والتجارية (مكاتب، مدارس، مستشفيات، مولات) لتشمل أيضاً البنية التحتية مثل الطرق والكباري والأنفاق والسدود والمطارات.' },
    { id: 103, lec: 1, cat: 'المواصفات', q: 'في مثال حساب الحمل الميت (Dead Load) بالمحاضرة الأولى، كم يبلغ إجمالي حمل طبقات الأرضية الأربع؟', opts: ['4.71 kN/m²', '5.80 kN/m²', '6.85 kN/m²', '8.90 kN/m²'], ans: 2, exp: 'مجموع طبقات الأرضية في جدول المحاضرة 1: بلاطة خرسانية (4.71) + عزل (0.08) + لياسة بيرلايت (1.96) + تشطيب (0.10) = 6.85 kN/m².' },
    { id: 104, lec: 1, cat: 'المواصفات', q: 'ما الحمل الذي يُعرف بأنه يتوزع بالتساوي على كامل طول الكمرة (evenly distributed along the length of the beam)؟', opts: ['Point Load', 'Uniformly Distributed Load (UDL)', 'Torsional Load', 'Axial Load'], ans: 1, exp: 'الحمل الموزع بانتظام (UDL) هو الحمل الموزع بالتساوي على طول الكمرة مثل وزن البلاطة أو الحائط المنتظم.' },
    { id: 105, lec: 1, cat: 'المواصفات', q: 'أي نوع من الأحمال يسبب التفافاً أو التواءً (twisting) حول المحور الطولي للكمرة؟', opts: ['Shear Load', 'Axial Load', 'Torsional Load', 'Temperature Load'], ans: 2, exp: 'حمل الليّ (Torsional Load) هو الحمل الذي يسبب التواءً أو التفافاً حول المحور الطولي للعنصر الإنشائي.' },
    { id: 106, lec: 1, cat: 'المواصفات', q: 'ما العوامل الأربعة الرئيسية التي تحدد قيمة وتأثير أحمال الرياح (Wind Loads) على الأسقف والواجهات؟', opts: ['لون الواجهة، نوع الطوب، عدد النوافذ، ونوع الأرضية', 'ارتفاع المبنى، الشكل الهندسي، الموقع، واتجاه الرياح', 'وزن الأثاث، عدد السكان، عمق الأساسات، وعمر المبنى', 'سمك البلاطة، نوع الأسمنت، قطر الحديد، ونسبة المياه'], ans: 1, exp: 'تعتمد أحمال الرياح على ارتفاع المبنى (building height)، الشكل الهندسي (geometry)، الموقع (location)، واتجاه الرياح (wind direction).' },
    { id: 107, lec: 1, cat: 'الاستخدامات', q: 'وفقاً لجدول الأحمال الحية (Live Loads) بالمحاضرة الأولى، ما قيمة الحمل الحي المنتظم للفصول الدراسية وغرف المرضى والغرف السكنية الخاصة؟', opts: ['40 psf (1.92 kN/m²)', '60 psf (2.87 kN/m²)', '100 psf (4.79 kN/m²)', '125 psf (6.00 kN/m²)'], ans: 0, exp: 'تصمم الفصول الدراسية وغرف المرضى والغرف السكنية الخاصة على حمل حي منتظم مقداره 40 psf (1.92 kN/m²).' },
    { id: 108, lec: 1, cat: 'الاستخدامات', q: 'ما قيمة الحمل الحي المنتظم للمخازن الثقيلة والصناعات الثقيلة (Heavy Storage & Heavy Manufacturing) في جدول المحاضرة الأولى؟', opts: ['80 psf (3.83 kN/m²)', '125 psf (6.00 kN/m²)', '250 psf (11.97 kN/m²)', '100 psf (4.79 kN/m²)'], ans: 2, exp: 'أعلى قيمة في جدول الأحمال الحية هي 250 psf (11.97 kN/m²) وتخص المخازن الثقيلة والصناعات الثقيلة.' },
    { id: 109, lec: 1, cat: 'المميزات', q: 'ما الفائدة الأساسية من تصنيف الأحمال إلى أحمال ميتة (Dead) وأحمال حية (Live) وديناميكية (Dynamic) عند التصميم؟', opts: ['زيادة تكلفة الخرسانة فقط', 'تقدير القوى الدائمة والمتغيرة والاهتزازات بدقة لتحقيق منشأ آمن ووظيفي', 'الاستغناء عن حساب أحمال الرياح', 'توحيد سمك جميع البلاطات في كل المباني'], ans: 1, exp: 'التمييز بين الأحمال الدائمة والمتغيرة والديناميكية يمكن المهندس من تصميم عناصر آمنة تلبي الاحتياجات الوظيفية والجمالية دون هدر أو مخاطرة.' },
    { id: 110, lec: 1, cat: 'العيوب', q: 'ماذا يحدث عند إغفال الأحمال الحرارية (Temperature Loads) أو الديناميكية (Dynamic Loads) في المنشآت المعرضة لها؟', opts: ['تقل تكلفة الصيانة السنوية', 'تتعرض العناصر الإنشائية لشروخ وإجهادات ناتجة عن التمدد والانكماش أو الاهتزازات', 'يزداد الحمل الميت تلقائياً', 'تتحول البلاطة من اتجاه واحد إلى اتجاهين'], ans: 1, exp: 'إغفال التمدد والانكماش الحراري أو الأحمال الديناميكية المتغيرة مع الزمن يؤدي إلى إجهادات غير محسوبة وتشققات تؤثر على سلامة المنشأ.' },

    // ==================== LECTURE 2 (10 Questions) ====================
    { id: 201, lec: 2, cat: 'المواصفات', q: 'ما الترتيب الصحيح لمسار انتقال الأحمال في نظام الكمرات البسيطة (Simple Beam System)؟', opts: ['كمرات ← بلاطات ← أعمدة ← قواعد', 'بلاطات ← أعمدة ← كمرات ← قواعد', 'بلاطات ← كمرات ← أعمدة ← قواعد ← تربة', 'قواعد ← أعمدة ← كمرات ← بلاطات'], ans: 2, exp: 'تنتقل الأحمال في نظام الكمرات البسيطة بالتسلسل: البلاطات (Slabs) ← الكمرات (Beams) ← الأعمدة (Columns) ← القواعد (Footings) ← التربة.' },
    { id: 202, lec: 2, cat: 'المواصفات', q: 'متى تُصنّف البلاطة المصمتة كبلاطة ذات اتجاه واحد (One-Way Slab) ومتى تُصنّف كاتجاهين (Two-Way Slab)؟', opts: ['One-Way عند b/a ≥ 2، و Two-Way عند b/a < 2', 'One-Way عند b/a < 2، و Two-Way عند b/a ≥ 2', 'One-Way عند b/a = 1 فقط', 'يعتمد على ارتفاع الدور فقط'], ans: 0, exp: 'إذا كانت نسبة الطول الأكبر إلى الأصغر (b/a) أكبر من أو تساوي 2 تكون البلاطة One-Way، وإذا كانت أقل من 2 تكون Two-Way.' },
    { id: 203, lec: 2, cat: 'المميزات', q: 'ما أبرز ميزة لنظام الكمرات البسيطة (Simple Beam System) ولماذا يُعد أساسياً في الإنشاءات؟', opts: ['يغطي بحوراً حتى 80 متراً بدون أعمدة', 'سهولة التصميم والتنفيذ وقدرته على حمل أنواع متعددة من الأحمال بتكلفة اقتصادية للبحور الصغيرة', 'عدم وجود أي كمرات ساقطة أسفل السقف', 'استخدام قوالب فايبرجلاس قابلة لإعادة الاستخدام'], ans: 1, exp: 'يشتهر نظام الكمرات البسيطة بسهولة تصميمه وتنفيذه ومرونته العالية في تحمل الأحمال للبحور الصغيرة والمتوسطة.' },
    { id: 204, lec: 2, cat: 'المميزات', q: 'أي نوع من الكمرات يُعد أكثر اقتصادية مقارنة بالأنواع الأخرى لارتكازه على أكثر من دعامتين؟', opts: ['الكمرة الكابولية (Cantilever)', 'الكمرة المستمرة (Continuous Beam)', 'الكمرة البسيطة (Simply Supported)', 'الكمرة المفصلية فقط'], ans: 1, exp: 'الكمرة المستمرة (Continuous Beam) ترتكز على دعامتين أو أكثر وتعد أكثر اقتصادية لأنها تقلل العزم الموجب في منتصف البحور.' },
    { id: 205, lec: 2, cat: 'العيوب', q: 'ما العيب المعماري الأبرز لنظام الكمرات البسيطة مقارنة بالبلاطات اللاكمرية (Flat Slab)؟', opts: ['لا يصلح للمباني السكنية', 'سقوط الكمرات أسفل السقف يقلل الارتفاع الصافي ويقيد تعديل الحوائط وتمرير التكييف', 'لا يقاوم أحمال الضغط في الأعمدة', 'يتطلب شدات معدنية مستوردة'], ans: 1, exp: 'بروز الكمرات الساقطة يقلل الارتفاع الصافي للغرفة ويقيد مرونة إزالة أو نقل القواطيع الداخلية ويزيد صعوبة تمرير مجاري التكييف.' },
    { id: 206, lec: 2, cat: 'الاستخدامات', q: 'في أي نوع من الفراغات والمشاريع يُستخدم نظام الكمرات البسيطة بكثافة؟', opts: ['هناجر الطائرات ببحر 60 م', 'الأرضيات والأسقف للمباني السكنية والغرف التقليدية (مثل 5×3 م و 6×4 م) والكباري البسيطة', 'المسارح الكبرى ببحر 20 م بدون أعمدة', 'القباب الخرسانية مزدوجة الانحناء'], ans: 1, exp: 'يستخدم نظام الكمرات البسيطة أساساً في الأسقف والأرضيات للمباني السكنية والغرف التقليدية (كما في تمريني 5×3 م و 6×4 م) والكباري البسيطة.' },
    { id: 207, lec: 2, cat: 'المواصفات', q: 'ما القاعدة الإنشائية للعلاقة بين عرض الكمرة (b) وسمك الحائط (t) في نظام الكمرات البسيطة؟', opts: ['يجب أن يكون عرض الكمرة نصف سمك الحائط', 'يجب أن يكون b = t أو b ≥ t (عرض الكمرة يساوي أو أكبر من سمك الحائط)', 'لا توجد علاقة بين عرض الكمرة والحائط', 'يجب أن يكون b أقل دائماً من 10 سم'], ans: 1, exp: 'كما في تفاصيل المحاضرة الثانية، يكون عرض الكمرة مساوياً لسمك الحائط (b = t) أو أكبر منه (b ≥ t) لضمان ارتكاز آمن، ويمكن أن تعمل ككمرة وعتب في آن واحد.' },
    { id: 208, lec: 2, cat: 'المواصفات', q: 'في تسليح البلاطة أو الكمرة الكابولية (Cantilever)، كم يمتد تسليح "الشوكة" العلوي داخل الباكية المجاورة؟', opts: ['0.5 Lc', '1.0 Lc', '1.5 Lc (مرة ونصف طول الكابولي)', '3.0 Lc'], ans: 2, exp: 'وفق تفصيلة التسليح في المحاضرة الثانية، يمتد حديد الشوكة للداخل مسافة تساوي 1.5 Lc لمقاومة العزم السالب وتأمين الاتزان.' },
    { id: 209, lec: 2, cat: 'المواصفات', q: 'لماذا يُعد العمود (Column) أخطر عنصر إنشائي في المبنى، وما نوع الإجهاد الرئيسي الذي يتحمله؟', opts: ['يتحمل الشد المحوري فقط', 'يتحمل الأحمال أساساً بالضغط (Compression) وتعتمد سلامة المبنى بالكامل على قوته', 'يتحمل أحمال الرياح فقط', 'يحمل البلاطة بدون نقل الحمل للقواعد'], ans: 1, exp: 'العمود عنصر رأسي يحمل الأحمال أساساً بالضغط، وأي انهيار فيه يهدد استقرار المبنى بأكمله.' },
    { id: 210, lec: 2, cat: 'العيوب', q: 'ما المشكلة التي تظهر في الأعمدة النحيفة عالية الارتفاع إذا لم تُربط بكمرات عرضية وسطية؟', opts: ['زيادة العزل الصوتي', 'حدوث الانبعاج (Buckling) وضعف مقاومة العمود للأحمال الرأسية', 'تقليل الوزن الذاتي للعمود', 'توقف انتقال الأحمال من البلاطة'], ans: 1, exp: 'توضح رسومات المحاضرة الثانية أن ربط الأعمدة بكمرات عرضية يقلل طول الانبعاج الحر (Buckling length) ويضاعف استقرار العمود.' },

    // ==================== LECTURE 3 (10 Questions) ====================
    { id: 301, lec: 3, cat: 'المواصفات', q: 'كيف تنتقل الأحمال في نظام البلاطات اللاكمرية (Flat Slab System)؟', opts: ['من البلاطة إلى كمرات ثانوية ثم رئيسية', 'من البلاطة مباشرة إلى الأعمدة بدون كمرات داخلية', 'من الأعصاب والبلوكات المفرغة إلى كمرات مخفية', 'عبر إطارات منحنية إلى الأرض'], ans: 1, exp: 'البلاطة اللاكمرية (Beamless Slab) ذات سمك منتظم وترتكز مباشرة على الأعمدة دون الحاجة لكمرات وسطية.' },
    { id: 302, lec: 3, cat: 'المميزات', q: 'ما مقدار التوفير في ارتفاع الدور عند استخدام نظام Flat Slab مقارنة بالنظام التقليدي لتحقيق ارتفاع صافي 2.8 م؟', opts: ['توفير 20 سم (3.2 م بدلاً من 3.4 م)', 'توفير 100 سم (2.4 م بدلاً من 3.4 م)', 'لا يوجد أي توفير في الارتفاع', 'يزيد ارتفاع الدور بمقدار 50 سم'], ans: 0, exp: 'توضح مقارنة المحاضرة الثالثة أن تحقيق ارتفاع صافي 2.8 م يتطلب 3.4 م في النظام التقليدي مقابل 3.2 م فقط في النظام اللاكمري.' },
    { id: 303, lec: 3, cat: 'المميزات', q: 'أي مما يلي يُعد من أبرز مميزات نظام البلاطات اللاكمرية (Flat Slab)؟', opts: ['مرونة معمارية عالية، سهولة تمديد الإضاءة والـ HVAC، سرعة الشدات', 'استخدام بلوكات فلين للعزل', 'أقل سمك خرسانة ممكن لكل البحور', 'عدم الحاجة إلى حديد تسليح علوي'], ans: 0, exp: 'يوفر الفلات سلاب سقفاً أملس يسهل تمديد التكييف والإضاءة، ويسرّع أعمال الشدات الخشبية، ويمنح مرونة معمارية. أما مقاومة الزلازل فتحتاج عادةً جدران قص أو أنظمة جانبية مساندة، لأن البلاطة المسطحة ضعيفة أمام الإزاحة الجانبية والقص الثاقب.' },
    { id: 304, lec: 3, cat: 'العيوب', q: 'ما أخطر نوع انهيار موضعي يهدد البلاطات اللاكمرية عند منطقة اتصال البلاطة بالعمود؟', opts: ['القص الثاقب (Punching Shear)', 'الالتواء الطولي (Torsion)', 'التمدد الحراري', 'انفصال البلوكات المفرغة'], ans: 0, exp: 'القص الثاقب (Punching Shear) يحدث نتيجة تركز الحمل على مساحة صغيرة حول العمود مما قد يسبب اختراق العمود للبلاطة.' },
    { id: 305, lec: 3, cat: 'المواصفات', q: 'ما الأنواع الأربعة الرئيسية للبلاطات اللاكمرية (Flat Slab) المذكورة في المحاضرة الثالثة؟', opts: ['اتجاه واحد، اتجاهين، مائلة، وإطارية', 'مسطحة (Flat Plate)، بسقوط (Drop Panel)، بتاج عمود (Column Capital)، وبكليهما معاً', 'أسمنتية، فخارية، فلين، وخشبية', 'خطية، متعددة الأضلاع، منحنية، وفرنديل'], ans: 1, exp: 'تصنف الفلات سلاب إلى 4 أنواع: بدون سقوط أو تاج (Flat Plate)، بسقوط بلاطة فقط، بتاج عمود فقط، أو بسقوط وتاج معاً.' },
    { id: 306, lec: 3, cat: 'المواصفات', q: 'ما معادلة السمك الأولي لبلاطة Two-Way Flat Plate مقارنة بـ Two-Way Flat Slab المزودة بـ Drop Panel؟', opts: ['Flat Plate: Span/33، و Flat Slab بسقوط: Span/36', 'كلاهما Span/16', 'Flat Plate: Span/24، و Flat Slab: Span/14', 'Flat Plate: Span/45، و Flat Slab: Span/20'], ans: 0, exp: 'وفق جداول Dimensions.com بالمحاضرة 3: سمك Flat Plate يساوي Span/33، بينما سمك Flat Slab المزودة بسقوط يساوي Span/36.' },
    { id: 307, lec: 3, cat: 'المواصفات', q: 'ما الأبعاد القياسية الدنيا لعرض وعمق سقوط البلاطة (Drop Panel) في نظام الفلات سلاب؟', opts: ['العرض ≥ 1/3 البحر، والعمق = 0.25 × سمك البلاطة', 'العرض = 1/10 البحر، والعمق = 2 × سمك البلاطة', 'العرض = عرض العمود فقط، والعمق = 5 سم', 'العرض ≥ 1/2 البحر، والعمق = سمك البلاطة بالكامل'], ans: 0, exp: 'وفق المحاضرة الثالثة، لا يقل عرض Drop Panel عن ثلث البحر (1/3 Span Length) ويكون عمق السقوط الإضافي 0.25 × سمك البلاطة.' },
    { id: 308, lec: 3, cat: 'المواصفات', q: 'ما مدى البحور التقليدية وبحور الشد اللاحق (Post-Tensioned) لنظام Two-Way Flat Plate في المحاضرة الثالثة؟', opts: ['تقليدي 1–3 م، و PT حتى 5 م', 'تقليدي 3.05–12.19 م، و PT من 5.49 إلى 14.33 م', 'تقليدي 15–30 م، و PT حتى 80 م', 'تقليدي 7–16 م، و PT حتى 24 م'], ans: 1, exp: 'تغطي Flat Plate بحوراً تقليدية من 3.05 إلى 12.19 م (10–40 قدم) وتصل بالشد اللاحق إلى 5.49–14.33 م (18–47 قدم).' },
    { id: 309, lec: 3, cat: 'الاستخدامات', q: 'في أي نوع من المباني يُفضل استخدام نظام Flat Slab System؟', opts: ['الشقق السكنية، المكاتب الإدارية، والمباني التجارية الخفيفة (مثل صالة 6×9 م)', 'هناجر الطائرات ببحر 60 م', 'المصانع الثقيلة ذات الأوناش العلوية الضخمة', 'الكباري المعلقة'], ans: 0, exp: 'تناسب البلاطات اللاكمرية المباني السكنية والمكاتب والمباني التجارية الخفيفة ذات البحور المتوسطة التي تحتاج لأسقف واضحة ومرونة داخلية.' },
    { id: 310, lec: 3, cat: 'العيوب', q: 'كيف تؤثر إزالة الكمرات على تصميم تسليح البلاطة في نظام Flat Slab مقارنة بالبلاطة المصمتة البسيطة؟', opts: ['تلغي الحاجة لشبكة تسليح علوية', 'تتطلب شبكتي تسليح (سفلية وعلوية) وتكثيف تسليح في شرائح الأعمدة (Column Strips) لمقاومة العزوم والقص', 'تقلل كمية الحديد إلى النصف دائماً', 'تمنع مرور مواسير الكهرباء داخل البلاطة'], ans: 1, exp: 'بسبب انتقال الأحمال مباشرة للأعمدة تتطلب الفلات سلاب تسليحاً سفلياً وعلوياً متكاملاً مع شرائح أعمدة (Column Strips) وشرائح وسطية (Middle Strips).' },

    // ==================== LECTURE 4 (10 Questions) ====================
    { id: 401, lec: 4, cat: 'المميزات', q: 'ما أبرز المميزات التي تجعلنا نختار نظام السقف الهوردي (Hollow Block System)؟', opts: ['تخفيف الوزن الميت، عزل حراري وصوتي ممتاز، توفير الخرسانة، مقاومة الحريق في البلوك الأسمنتي والفخاري (دون البوليسترين)، وسهولة التنفيذ الوحداتي', 'تحمل بحور 80 متراً بدون أعمدة', 'عدم الحاجة لحديد تسليح في الأعصاب', 'الاستغناء عن القواعد الخرسانية'], ans: 0, exp: 'يجمع السقف الهوردي بين تقليل الوزن الميت، العزل الحراري والصوتي بفضل الفراغات، الاقتصاد في الخرسانة، ومقاومة جيدة للحريق في البلوك الأسمنتي والفخاري (بلوك البوليسترين قابل للاشتعال).' },
    { id: 402, lec: 4, cat: 'المواصفات', q: 'ما المكونات الإنشائية الرئيسية لبلاطة السقف الهوردي (Hollow Block Slab)؟', opts: ['بلاطة تغطية علوية (ts)، أعصاب (Ribs)، بلوكات مفرغة، جزء مصمت (Solid Part)، وعصب عرضي (Cross Rib)', 'تيجان أعمدة وسقوط بلاطة فقط', 'إطارات منحنية وسملات فقط', 'كمرات مائلة بزاوية 45 درجة فقط'], ans: 0, exp: 'تتكون بلاطة الهوردي من بلاطة التغطية العلوية والأعصاب الحاملة والبلوكات المفرغة والجزء المصمت عند الكمرات بالإضافة للعصب العرضي (X-rib).' },
    { id: 403, lec: 4, cat: 'المواصفات', q: 'وفق اشتراطات الكود بالمحاضرة الرابعة، ما الحد الأقصى لعرض البلوك (e) والحد الأدنى لعرض العصب (b) وسمك البلاطة العلوية (ts)؟', opts: ['e ≤ 700 مم، b ≥ max(100 مم, t/3)، ts ≥ max(50 مم, e/10)', 'e ≤ 200 مم، b ≥ 50 مم، ts ≥ 20 مم', 'e ≤ 1500 مم، b ≥ 300 مم، ts ≥ 150 مم', 'e ≤ 400 مم، b ≥ 250 مم، ts ≥ 100 مم'], ans: 0, exp: 'ينص الكود على: e ≤ 700 mm، و b ≥ الأكبر من (100 mm أو t/3)، و ts ≥ الأكبر من (50 mm أو e/10)، والجزء المصمت X ≥ 150 mm.' },
    { id: 404, lec: 4, cat: 'المواصفات', q: 'ما القيم العملية الشائعة في الموقع لـ e و b والمسافة المحورية بين الأعصاب S في نظام الهوردي؟', opts: ['e = 400 mm، b = 100 mm، S = 500 mm', 'e = 800 mm، b = 200 mm، S = 1000 mm', 'e = 200 mm، b = 50 mm، S = 250 mm', 'e = 600 mm، b = 150 mm، S = 750 mm'], ans: 0, exp: 'القيم العملية القياسية في المحاضرة الرابعة هي: e = 400 مم، b = 100 مم، وبالتالي S = e + b = 500 مم، وارتفاع البلوك h = 150 أو 200 أو 250 مم.' },
    { id: 405, lec: 4, cat: 'العيوب', q: 'ما الإجراء التنفيذي الإلزامي لآخر بلوك في كل صف من البلوكات المفرغة، ولماذا؟', opts: ['يُترك مكسوراً لزيادة الوزن', 'يوضع معكوساً (عكس البلوكات الأخرى) لمنع دخول الخرسانة داخل فراغات البلوك أثناء الصب', 'يُستبدل بخشب دائم', 'يوضع فوق طبقة التسليح العلوية'], ans: 1, exp: 'تسرب الخرسانة داخل البلوكات يبطل ميزة تخفيف الوزن ويزيد الحمل الميت؛ لذا يوضع آخر بلوك معكوساً لغلق الفتحات الجانبية.' },
    { id: 406, lec: 4, cat: 'المواصفات', q: 'في مقارنة بلوكات السوق المصري بالمحاضرة الرابعة، كم يبلغ وزن بلوك الفلين (البوليسترين) مقارنة بالبلوك الأسمنتي (40×20×20) في اتجاه واحد؟', opts: ['الفلين 0.70 kN/m² مقابل الأسمنتي 3.30 kN/m²', 'كلاهما 3.30 kN/m²', 'الفلين 4.10 kN/m² مقابل الأسمنتي 0.70 kN/m²', 'الفلين 2.70 kN/m² مقابل الأسمنتي 1.20 kN/m²'], ans: 0, exp: 'بلوك الفلين أخف بمقدار كبير جداً (0.70 kN/m² في اتجاه واحد و 1.20 في اتجاهين) مقارنة بالأسمنتي 20 سم (3.30 و 3.80 kN/m²).' },
    { id: 407, lec: 4, cat: 'العيوب', q: 'ما العيب الرئيسي لكل من البلوك الأسمنتي وبلوك الفلين (البوليسترين) في نظام السقف الهوردي؟', opts: ['الأسمنتي يزيد الوزن الميت على الهيكل، والفلين ضعيف ميكانيكياً ولا يتحمل أحمالاً مباشرة', 'الأسمنتي لا يقاوم الحريق، والفلين ثقيل جداً', 'كلاهما غير متوفر في السوق المصري', 'الأسمنتي يمنع تركيب الأعصاب، والفلين يصدأ'], ans: 0, exp: 'البلوك الأسمنتي متين لكنه ثقيل (12–20 كجم)، أما الفلين فأخف وزناً (2–4 كجم) وممتاز للعزل لكنه لا يتحمل أحمالاً مباشرة.' },
    { id: 408, lec: 4, cat: 'المميزات', q: 'ما ميزة البلوك الفخاري (الأحمر/الطفلي) مقارنة بالبلوك الأسمنتي في نظام الهوردي؟', opts: ['أخف وزناً (8–15 كجم) ويوفر عزلاً حرارياً وصوتياً أفضل من الأسمنتي', 'أقوى وأثقل من الأسمنتي', 'أخف وزناً من الفلين', 'لا يحتاج لأي أعصاب خرسانية'], ans: 0, exp: 'البلوك الفخاري يزن 8–15 كجم فيكون أخف من الأسمنتي وأفضل منه في العزل الحراري والصوتي، وإن كان أقل منه في القوة.' },
    { id: 409, lec: 4, cat: 'الاستخدامات', q: 'كيف يُستخدم نظام السقف الهوردي في المباني، وما أنواع الكمرات التي يمكن دمجه معها؟', opts: ['للصالات المتوسطة (مثل 7×9 م) ويمكن تنفيذه مع كمرات ساقطة (Projected) أو كمرات مخفية (Hidden Beams)', 'للغرف الصغيرة أقل من 2 م فقط', 'مع كمرات معدنية فقط', 'في الأساسات فقط'], ans: 0, exp: 'يُقسم الهوردي إلى One-Way و Two-Way، وكلاهما ينفذ إما بكمرات ساقطة (Projected) أو كمرات مخفية (Hidden) للحصول على سقف مستوٍ.' },
    { id: 410, lec: 4, cat: 'المواصفات', q: 'ما النسبة التقريبية لتكلفة البلاطات من إجمالي تكلفة الخرسانة المسلحة للمبنى، ولماذا يجب تصميم الهوردي على الترخيم (Deflection) بجانب العزم والقص؟', opts: ['15–20% من تكلفة الخرسانة؛ والتصميم على الترخيم يمنع اهتزاز البلاطة (Vibration-free slab)', '2% فقط؛ ولا يؤثر الترخيم على الاهتزاز', '80% من تكلفة المبنى؛ لمنع الصدأ فقط', '50% من تكلفة الحديد؛ لتقليل العزل الصوتي'], ans: 0, exp: 'تمثل البلاطات 15–20% من تكلفة الخرسانة المسلحة، وتصميمها للعزم والقص فقط يعطي سمكاً أقل قد يسبب اهتزازاً؛ لذا يجب التصميم للترخيم أيضاً.' },

    // ==================== LECTURE 5 (10 Questions) ====================
    { id: 501, lec: 5, cat: 'المواصفات', q: 'ما التعريف الدقيق لنظام البلاطة الشبكية (Waffle Slab System)؟', opts: ['بلاطة ذات اتجاهين مسلحة بشبكة أعصاب متعامدة تشبه الوافل، سطحها العلوي مستوٍ والسفلي مجوّف', 'بلاطة مسطحة مصمتة بالكامل بدون أعصاب', 'إطار خرساني خطي أحادي الاتجاه', 'بلاطة هوردي ذات اتجاه واحد ببلوكات طوب'], ans: 0, exp: 'الوافل سلاب بلاطة ذات اتجاهين مقواة بأعصاب في اتجاهين متعامدين بسطح علوي مستوٍ وتجاويف سفلية تقلل الخرسانة والوزن.' },
    { id: 502, lec: 5, cat: 'المميزات', q: 'ما أبرز ميزة إنشائية لنظام Waffle Slab مقارنة بنظام Flat Slab؟', opts: ['قدرته على حمل أحمال أثقل وتغطية بحور أطول مع تقليل الترخيم وكمية الخرسانة', 'تكلفة شدات خشبية أقل بكثير', 'سمك سقف أصغر دائماً من الفلات سلاب', 'عدم الحاجة لمنطقة مصمتة عند الأعمدة'], ans: 0, exp: 'يتميز الوافل سلاب بقدرته على حمل أحمال أثقل وتغطية بحور أطول من الفلات سلاب مع صلابة عالية وتقليل للترخيم وكمية الخرسانة.' },
    { id: 503, lec: 5, cat: 'المميزات', q: 'ما الميزة المعمارية والخدمية للتجاويف السفلية في نظام Waffle Slab؟', opts: ['تُستخدم كعنصر جمالي مكشوف للسقف وتسهل تركيب وحدات الإضاءة والخدمات والعزل الصوتي', 'تُملأ بالرمل لزيادة الوزن', 'تمنع تركيب أنظمة التكييف', 'تُغلق دائماً بطوب أحمر'], ans: 0, exp: 'يمنح النمط الشبكي المكشوف جمالاً معمارياً مميزاً وتُستغل الفراغات بين الأعصاب لتوزيع الإضاءة والخدمات الكهربائية والميكانيكية.' },
    { id: 504, lec: 5, cat: 'العيوب', q: 'ما أبرز التحديات أو العيوب المرتبطة بتنفيذ نظام Waffle Slab في الموقع؟', opts: ['ارتفاع تكلفة وتعقيد القوالب الخاصة (Domes/Pans) وزيادة سمك السقف الكلي مقارنة بالبلاطة المصمتة', 'ضعف مقاومة الحريق', 'عدم صلاحيته للبحور الأكبر من 5 م', 'انعدام الصلابة في الاتجاهين'], ans: 0, exp: 'يتطلب الوافل سلاب قوالب قياسية خاصة (بلاستيك/فايبرجلاس) ودقة في الرص والصب، كما أن عمق السقف (Span/24) يكون كبيراً نسبياً.' },
    { id: 505, lec: 5, cat: 'المواصفات', q: 'ما مدى البحور التقليدية وبحور الشد اللاحق (Post-Tensioned) لنظام Waffle Slab وفق المحاضرة الخامسة؟', opts: ['تقليدي 7.62–16.76 م (7–16 م)، و Post-Tensioned من 9.14 إلى 24.38 م', 'تقليدي 2–5 م، و PT حتى 7 م', 'تقليدي 3–6 م، و PT حتى 10 م', 'تقليدي 25–40 م، و PT حتى 80 م'], ans: 0, exp: 'تغطي بلاطة الوافل بحوراً تقليدية من 7.62 إلى 16.76 م (أو 7–16 م)، وتصل بالشد اللاحق إلى 9.14–24.38 م.' },
    { id: 506, lec: 5, cat: 'المواصفات', q: 'ما معادلة العمق الأولي (Slab Depth Formula) لنظام Waffle Slab وعرض الأعصاب القياسي؟', opts: ['العمق = Span/24 (25.4–73.7 سم)، وعرض الأعصاب 12.5–15 سم', 'العمق = Span/36، وعرض الأعصاب 5 سم', 'العمق = Span/14، وعرض الأعصاب 40 سم', 'العمق = Span/45، وعرض الأعصاب 10 سم'], ans: 0, exp: 'يحسب العمق الأولي للوافل سلاب بالمعادلة Span/24، ويتراوح عرض الأعصاب بين 12.5 و 15 سم.' },
    { id: 507, lec: 5, cat: 'المواصفات', q: 'ما المقاسات القياسية لوحدات القوالب (Modules / Domes) المذكورة في محاضرة Waffle Slab؟', opts: ['48×48، 60×60، 76×76، أو 90×90 سم', '10×10 و 20×20 سم', '150×150 و 200×200 سم', '40×20 سم فقط'], ans: 0, exp: 'تتوافر قوالب الوافل بموديولات قياسية تبدأ من 48×48 سم أو 60×60 سم أو 76×76 سم أو 90×90 سم بعمق قبة 20–51 سم.' },
    { id: 508, lec: 5, cat: 'المواصفات', q: 'ماذا يُفعل بقوالب الوافل (Pans) في المنطقة المجاورة للأعمدة ولماذا؟', opts: ['تُزال القوالب بالقرب من العمود لتكوين منطقة مصمتة تقاوم القص الثاقب والعزوم السالبة', 'تُرص قوالب أعمق حول العمود', 'تُستبدل ببلوكات فلين', 'تُترك فتحات تهوية حول العمود'], ans: 0, exp: 'توضح الرسومات الإنشائية بالمحاضرة الخامسة قاعدة "Pans removed near column" لتكوين رأس خرساني مصمت فوق الأعمدة.' },
    { id: 509, lec: 5, cat: 'الاستخدامات', q: 'أي من المباني التالية يُعد الاستخدام الأمثل لنظام Waffle Slab System؟', opts: ['المسارح والمدرجات، الجراجات متعددة الطوابق، والصالات الواسعة (مثل صالة 10×14 م)', 'الغرف السكنية الصغيرة 3×3 م', 'الأسوار الخارجية', 'الكباري المعلقة بالكابلات'], ans: 0, exp: 'يُعد الوافل سلاب مثالياً للمساحات المفتوحة كبيرة البحر كالمدرجات (Auditoriums) والجراجات (Parking Garages) والصالات الكبرى.' },
    { id: 510, lec: 5, cat: 'الاستخدامات', q: 'في مثال Free Education Unit بسريلانكا بالمحاضرة الخامسة، كيف تكامل نظام Waffle Slab مع باقي عناصر المبنى؟', opts: ['ارتكزت بلاطة الوافل على أعمدة متقاطعة قوية مقاومة للأمواج مع تقليل كمية الخرسانة وتوفير فتحات تهوية', 'استُخدمت مع حوائط حاملة من الطوب اللبن فقط', 'استُخدمت كجسر للسيارات', 'أُلغيت فيها جميع الأعمدة'], ans: 0, exp: 'يوضح القطاع المعماري لمشروع Ahungalla بسريلانكا استخدام أعمدة متقاطعة (Cross columns) مع بلاطة وافل لتقليل الخرسانة وتوفير فتحات تهوية.' },

    // ==================== LECTURE 6 (10 Questions) ====================
    { id: 601, lec: 6, cat: 'المواصفات', q: 'ما الفكرة الإنشائية الأساسية لنظام الكمرات المتقاطعة (Paneled Beam System)؟', opts: ['شبكة من كمرات متقاطعة متكافئة تعمل معاً كـ Grid Action وتقسم السقف لبلاطات صغيرة (a × b)', 'كمرة رئيسية واحدة تحمل كمرات ثانوية أصغر منها', 'بلاطة بدون أي كمرات داخلية', 'إطار خرساني منحني'], ans: 0, exp: 'تتقاطع الكمرات الداخلية B1 و B2 لتعمل كشبكة موحدة (Grid Action) تتكون بينها بلاطات صغيرة مصمتة أو مفرغة.' },
    { id: 602, lec: 6, cat: 'المميزات', q: 'ما أبرز مميزات نظام الكمرات المتقاطعة (Paneled Beams) في تغطية القاعات؟', opts: ['توزيع متكافئ للأحمال، تقليل سمك البلاطات، اقتصاد للبحور الكبيرة (80–150 م²)، ومقاومة عالية للانحناء والالتواء', 'سهولة وسرعة الشدات الخشبية بدون أي تعقيد', 'زيادة الارتفاع الصافي أكثر من الفلات سلاب', 'إمكانية بناء حوائط ثقيلة في أي مكان فوق الكمرات الداخلية'], ans: 0, exp: 'يشترك النظام في حمل الأحمال عبر عدة كمرات مما يقلل سمك البلاطة ويعطي ثباتاً إنشائياً عالياً لمساحات 80–150 م² بلا أعمدة داخلية.' },
    { id: 603, lec: 6, cat: 'العيوب', q: 'أي مما يلي يُعد من العيوب والقيود المذكورة لنظام Paneled Beam System في المحاضرة السادسة؟', opts: ['تعقيد الشدات الخشبية والتسليح، تقليل الارتفاع الصافي بسبب عمق الكمرات، وزيادة الوزن الذاتي', 'عدم إمكانية استخدامه مع الخرسانة المسلحة', 'عجزه عن تغطية مساحات أكبر من 30 م²', 'انعدام الفراغ لتمرير الخدمات'], ans: 0, exp: 'من عيوب النظام: تعقيد ضبط استقامة الكمرات والتسليح، كثافة عمالة الشدات (Formwork)، تقليل الارتفاع الصافي، وزيادة الوزن الذاتي.' },
    { id: 604, lec: 6, cat: 'العيوب', q: 'ما القيد المعماري المهم بخصوص الحوائط الداخلية في نظام الكمرات المتقاطعة؟', opts: ['يجب بناء حائط تحت كل كمرة داخلية', 'لا يمكن وضع حوائط على الكمرات الداخلية المتقاطعة', 'يسمح ببناء حوائط خرسانية مسلحة فوقها فقط', 'لا توجد أي قيود على الحوائط'], ans: 1, exp: 'تنص المحاضرة السادسة صراحةً على أنه "لا يمكن وضع حوائط على الكمرات الداخلية" للحفاظ على توزيع الأحمال الشبكي المنتظم.' },
    { id: 605, lec: 6, cat: 'المواصفات', q: 'ما الشرط الهندسي لطولي الكمرات المتقاطعة الداخلية لضمان ألا تحمل إحداهما الأخرى؟', opts: ['نفس المادة والقطاع وألا تتجاوز نسبة الطول الأكبر للأصغر 4/3', 'أن يكون طول إحداهما ضعف الأخرى (2/1)', 'أن تكون إحداهما من الصلب والأخرى من الخرسانة', 'أن يكون عمق إحداهما نصف عمق الأخرى'], ans: 0, exp: 'لضمان العمل الشبكي المتكافئ يجب أن تكون الكمرات الداخلية من نفس المادة والقطاع وألا يتجاوز الطول 4/3 من الطول الآخر.' },
    { id: 606, lec: 6, cat: 'المواصفات', q: 'ما المسافات المفضلة (a, b) بين الكمرات الداخلية في نظام Paneled Beams، والمدى المساحي المعتاد؟', opts: ['المسافات 2.0–5.0 م، والمساحة 80–150 م² (ويحتاج ما يزيد عنها إلى Paneled Frames بدراسة خاصة)', 'المسافات 0.5–1.0 م، والمساحة 20 م²', 'المسافات 10–15 م، والمساحة 2000 م²', 'المسافات 6–8 م، والمساحة 50 م²'], ans: 0, exp: 'يفضل أن تتراوح المسافات بين الكمرات الداخلية من 2.0 إلى 5.0 م، وتغطي مساحة 80–150 م² دون أعمدة داخلية، وتحتاج المساحات الأكبر إلى Paneled Frames بدراسة إنشائية خاصة.' },
    { id: 607, lec: 6, cat: 'المواصفات', q: 'كيف تُحسب أبعاد الكمرة الرئيسية الخارجية (B3, B4) والكمرة الداخلية (B1, B2) في نظام الكمرات المتقاطعة؟', opts: ['الخارجية: عمق Ls/16 وعرض 25–30 سم؛ الداخلية: عمق Ls/24 وعرض 15–25 سم (مع التقريب لأقرب 5 سم)', 'الخارجية: عمق Ls/36؛ الداخلية: عمق Ls/10', 'كلاهما بنفس القطاع Ls/20 وعرض 12 سم', 'الداخلية أكبر قطاعاً من الخارجية'], ans: 0, exp: 'يجب أن تكون الكمرات الخارجية أكبر قطاعاً من الداخلية: الخارجية Ls/16 (عرض 25–30 سم) والداخلية Ls/24 (عرض 15–25 سم) وتقرب بالزيادة لأقرب 5 سم.' },
    { id: 608, lec: 6, cat: 'المواصفات', q: 'كيف يُحسب سمك البلاطة الصغيرة بين الكمرات المتقاطعة؟', opts: ['Ls / (35 إلى 45)', 'Ls / 10', 'Ls / 16', 'ثابت 40 سم دائماً'], ans: 0, exp: 'لحساب سمك بلاطات الأسقف في نظام الكمرات المتقاطعة يقسم البحر الصغير على 35 أو 40 أو 45.' },
    { id: 609, lec: 6, cat: 'المواصفات', q: 'ما أنواع أنظمة الكمرات المتقاطعة الخاصة المذكورة في المحاضرة السادسة لتقليل البحور أو زيادة المساحة؟', opts: ['الكمرات المتقاطعة المائلة (Skew Paneled Beams) والإطارات المتقاطعة (Paneled Frames)', 'بلاطات مسطحة بتاج عمود فقط', 'كمرات كابولية حرة فقط', 'عقود مزدوجة الانحناء فقط'], ans: 0, exp: 'عند الرغبة في تقليل أطوال الكمرات تستخدم Skew Paneled Beams (مائلة 45°)، وعند زيادة المساحة عن 150 م² تستخدم Paneled Frames.' },
    { id: 610, lec: 6, cat: 'الاستخدامات', q: 'ما دراسة الحالة المحلية المذكورة في المحاضرة السادسة لتطبيق نظام Paneled Beams في المباني التعليمية؟', opts: ['مبنى قسم العمارة بجامعة أسيوط (المدرجات، استوديوهات التصميم، ومعرض المشاريع)', 'مبنى أوبرا سيدني', 'برج خليفة', 'جسر البوابة الذهبية'], ans: 0, exp: 'استعرضت المحاضرة السادسة مساقط مبنى قسم العمارة بجامعة أسيوط كمثال واقعي متكامل للكمرات المتقاطعة في الاستوديوهات والقاعات.' },

    // ==================== LECTURE 7 (10 Questions) ====================
    { id: 701, lec: 7, cat: 'المواصفات', q: 'ما النظرية الإنشائية التي يقوم عليها نظام الإطارات الخرسانية (Concrete Frames) لزيادة البحور؟', opts: ['نظرية الاستمرارية المادية والهندسية حيث يُصب العمود والكمرة كعنصر واحد متصل (Monolithic Rigid Joint)', 'فصل العمود تماماً عن الكمرة بمفصلات مطاطية', 'الاعتماد على بلوكات مفرغة فقط', 'توزيع الحمل على حوائط طوب حاملة'], ans: 0, exp: 'في الإطارات وبفعل الاستمرارية المادية والهندسية يصبح العمود والكمرة عنصراً واحداً مما يقلل العزوم ويزيد البحور الممكنة.' },
    { id: 702, lec: 7, cat: 'المميزات', q: 'ما أبرز مميزات نظام الإطارات الخرسانية المقاومة للعزوم (Moment-Resisting Concrete Frames)؟', opts: ['تغطية بحور كبيرة (15–40 م بالخرسانة المسلحة العادية)، مقاومة عالية للأحمال الرأسية والجانبية، وحرية معمارية في تشكيل الكتل', 'عدم الحاجة لشدات خشبية معقدة', 'انعدام عمق الكمرات الساقطة', 'أقل وزن ذاتي بين جميع الأنظمة'], ans: 0, exp: 'توفر الإطارات الخرسانية قدرة تحميل عالية ومقاومة ممتازة للقوى الجانبية وحرية معمارية واسعة في تغطية البحور الكبيرة.' },
    { id: 703, lec: 7, cat: 'العيوب', q: 'ما أبرز العيوب والتحديات التنفيذية لنظام الإطارات الخرسانية (Concrete Frames)؟', opts: ['تعقيد وصلات التسليح والشدات، زيادة عمق الكمرات والوزن الذاتي، وضرورة وجود مدادات وبلاطات لتغليف الفراغ', 'عدم مقاومتها للرياح والزلازل', 'قصر عمرها الافتراضي', 'عجزها عن تغطية بحور أكبر من 6 م'], ans: 0, exp: 'تتطلب الإطارات دقة عالية في تسليح الأركان والشدات، وتزيد عمق الكمرات والوزن، كما أنها "ترسم الفراغ ولا تغلفه" فتحتاج مدادات وبلاطات.' },
    { id: 704, lec: 7, cat: 'المواصفات', q: 'ما أبعاد الإطار الخرساني البسيط (Simple Concrete Frame) المذكورة في المحاضرة السابعة؟', opts: ['البحر 12–22 م، التباعد 4–6 م، عمق الكمرة الرئيسية L/(14–16)، وعرضها 30–40 سم', 'البحر 3–6 م، التباعد 1 م، عمق الكمرة L/36', 'البحر 5–9 م، التباعد 0.5 م، عمق الكمرة 20 سم', 'البحر 80–120 م، التباعد 20 م، عرض الكمرة 10 سم'], ans: 0, exp: 'في Simple Concrete Frame: البحر 12–22 م، التباعد 4–6 م، عمق الكمرة الرئيسية L/14 إلى L/16 بعرض 30–40 سم، والكمرات الثانوية بعمق Spacing/10.' },
    { id: 705, lec: 7, cat: 'المواصفات', q: 'كيف تزداد مقاومة الإطارات الخرسانية للأحمال وقوى الدفع الأفقية عند منسوب الأساسات؟', opts: ['بعمل كمرة أفقية (سملات / Tie Beam) تربط أساسات أعمدة الإطارات ببعضها', 'بإلغاء القواعد المسلحة', 'بتقليل عرض الأعمدة عند القاعدة إلى 10 سم', 'بفصل الأعمدة عن الأساسات'], ans: 0, exp: 'تنص المحاضرة السابعة على أن مقاومة الإطارات للأحمال تزداد بعمل كمرة أفقية (سملات) تربط أساسات أعمدة الإطارات لمقاومة الدفع الأفقي.' },
    { id: 706, lec: 7, cat: 'المواصفات', q: 'كيف تتغير الإجهادات عندما يتحول الإطار الخطي (Linear Frame) إلى إطار متعدد الأضلاع (Polygonal Frame) ينطبق على مضلع القوى؟', opts: ['تزداد إجهادات الضغط وتقل إجهادات الانحناء فتزيد كفاءة الهيكل', 'تزداد إجهادات الانحناء وتنعدم إجهادات الضغط', 'يتحول الهيكل إلى شد صرف', 'تقل القدرة على تغطية البحور'], ans: 0, exp: 'كلما انطبق شكل الإطار متعدد الأضلاع على مضلع القوى تعرض معظمه لإجهادات ضغط وقلت إجهادات الانحناء.' },
    { id: 707, lec: 7, cat: 'المواصفات', q: 'في الإطارات المنحنية والعقود (Curvilinear Frames)، لماذا تُعد العقود الثابتة (Fixed Arches) أقوى من العقود المفصلية؟', opts: ['لأنها تقدم مقاومة أعلى لقوة الدفع الأفقية الناتجة عن الرياح والحرارة مقارنة بالاتصال المفصلي الحر', 'لأنها لا تحتاج إلى أساسات', 'لأنها مصنوعة من الفلين', 'لأنها لا تتعرض لأي أحمال رأسية'], ans: 0, exp: 'الاتصال المفصلي الحر أضعف من الاتصال الثابت؛ لذا تُعد العقود الثابتة أقوى وأكثر مقاومة للدفع الأفقي القادم من الرياح والحرارة.' },
    { id: 708, lec: 7, cat: 'الاستخدامات', q: 'ما الاستخدام الرئيسي لكمرات وإطارات فرنديل (Vierendeel Girders) في المباني متعددة الطوابق؟', opts: ['حذف نقاط الارتكاز (الأعمدة) في الطابق الأرضي أو المتكرر لخلق فراغات مفتوحة واسعة', 'تغطية الحمامات والمطابخ الصغيرة فقط', 'العمل كقواطيع غير حاملة', 'تخفيف العزل الصوتي'], ans: 0, exp: 'تتيح إطارات فرنديل (Vierendeel Girders) حذف الأعمدة في الدور الأرضي أو المتكرر ونقل أحمال الأدوار العليا إلى أعمدة طرفية متباعدة.' },
    { id: 709, lec: 7, cat: 'المواصفات', q: 'كيف يتم معالجة وضمان ثبات الإطار على شكل حرف T (T-Frame) ذي العمود الواحد؟', opts: ['إما بربط الإطارات سوياً ومع الحوائط الجانبية أو تثبيتها تثبيتاً كاملاً في الأرض (Fixed Support)', 'بتركه حراً على مفصل واحد بدون ربط', 'بزيادة ارتفاعه دون تغيير الأساس', 'بإزالة الكابولي من جانب واحد'], ans: 0, exp: 'توضح المحاضرة السابعة أن الإطار على شكل حرف T يحتاج لضمان ثباته إما للربط مع الحوائط الجانبية أو التثبيت التام في الأساسات (Fixed Support).' },
    { id: 710, lec: 7, cat: 'الاستخدامات', q: 'أي من المشاريع العالمية التالية عُرض كمثال تطبيقي متميز لأنظمة الإطارات الخرسانية في المحاضرة السابعة؟', opts: ['مبنى Vodafone (Baumschlager Eberle) ووحدة UIAC بجامعة ليون (Landa + Martínez)', 'مبنى قسم العمارة بأسيوط فقط', 'منزل طيني تقليدي', 'مستودع خشبي مؤقت'], ans: 0, exp: 'استعرضت المحاضرة السابعة أمثلة معمارية بارزة للإطارات الخرسانية مثل مبنى Vodafone ووحدة الابتكار UIAC في ليون وصالات السباحة ذات الإطارات المتكررة.' }
  ];

  const REFERENCES = [
    { author: 'Ching, F. D. K. (2014)', title: 'Building Construction Illustrated (5th ed.)', pub: 'John Wiley & Sons', desc: 'دليل بصري شامل لتشريح ووظيفة العناصر المعمارية والإنشائية المختلفة، ويعد مرجعاً أساسياً لفهم أنظمة البناء.' },
    { author: 'Emmitt, S., & Gorse, C. (2018)', title: 'Barry’s Introduction to Construction of Buildings (4th ed.)', pub: 'Wiley-Blackwell', desc: 'مرجع رئيسي لطرق البناء التقليدية والحديثة، يشرح بالتفصيل مبادئ انتقال الأحمال والوصلات بين العناصر الإنشائية.' },
    { author: 'Allen, E., & Iano, J. (2019)', title: 'The Architect’s Studio Companion: Rules of Thumb for Preliminary Design (6th ed.)', pub: 'John Wiley & Sons', desc: 'مرجع عملي لفهم التكامل بين الأنظمة المعمارية والإنشائية وقواعد التقدير الأولي لأبعاد العناصر (Rules of Thumb).' },
    { author: 'Harris, C. M., & McCaffer, R. (2013)', title: 'Modern Construction Management (7th ed.)', pub: 'Wiley-Blackwell', desc: 'يغطي طرق البناء الحديثة واستراتيجيات التخطيط وتنظيم الموقع وخطط التنفيذ.' },
    { author: 'Mackay, J. K., & Law, J. (2013)', title: 'Reinforced Concrete Design: A Practical Approach', pub: 'CRC Press', desc: 'مرجع متخصص في التحليل التفصيلي للمنشآت الخرسانية المسلحة ومقاومة الأحمال وتقنيات التنفيذ.' },
    { author: 'McMorrough, J. (2006)', title: 'Materials, Structures, and Standards', pub: 'Rockport Publishers', desc: 'دليل عملي للمعماريين لفهم العناصر المكملة للمباني مثل الأسقف المعلقة والقواطيع والواجهات الستائرية.' },
    { author: 'Cowan, H. J., & Smith, P. R. (2004)', title: 'Dictionary of Architectural and Building Technology (4th ed.)', pub: 'Routledge', desc: 'قاموس مرجعي للمصطلحات الفنية والتعريفات المرتبطة بمواد وطرق الإنشاء.' }
  ];

  const EXERCISE_PRESETS = [
    { label: 'تمرين 1أ (غرفة 5×3 م)', l: 5, w: 3, lec: 'محاضرة 2' },
    { label: 'تمرين 1ب (غرفة 6×4 م)', l: 6, w: 4, lec: 'محاضرة 2' },
    { label: 'تمرين 2 (صالة 6×9 م)', l: 9, w: 6, lec: 'محاضرة 3' },
    { label: 'تمرين 3 (صالة 7×9 م)', l: 9, w: 7, lec: 'محاضرة 4' },
    { label: 'تمرين 4 (صالة 10×14 م)', l: 14, w: 10, lec: 'محاضرة 5' },
    { label: 'تمرين 5 (صالة 10×15 م)', l: 15, w: 10, lec: 'محاضرة 6' },
    { label: 'تمرين 6 (صالة 12×18 م)', l: 18, w: 12, lec: 'محاضرة 7' }
  ];

  // =========================================================================
  // APPLICATION STATE
  // =========================================================================
  let completedInit = [];
  try {
    const saved = localStorage.getItem('bc2_completed_v1');
    if (saved) completedInit = JSON.parse(saved);
  } catch (e) { completedInit = []; }

  const state = {
    activeView: 'home',
    activeLecture: 1,
    completedLectures: new Set(completedInit),
    // Lec 1
    selectedLoadId: 'udl',
    deadLayers: DEFAULT_DEAD_LAYERS.map(x => ({ ...x })),
    useSlideExact: true,
    liveFilterCat: 'الكل',
    liveSearch: '',
    // Lec 2
    loadPathStep: 1,
    slabA: 4.0,
    slabB: 6.0,
    beamType: 'simply',
    // Lec 3
    flatType: 'both',
    flatSpan: 7.5,
    // Lec 4
    hbBlockId: 'c20',
    hbDir: 'oneway',
    // Lec 5
    waffleSpan: 12.0,
    waffleModule: 60,
    // Lec 6
    pbL: 12.0,
    pbLs: 10.0,
    pbType: 'simple',
    // Lec 7
    frameType: 'linear',
    frameSpan: 18.0,
    frameSpacing: 5.0,
    // Lab
    labL: 12.0,
    labW: 9.0,
    // Quiz
    lecDetailTab: 'adv',
    quizFilter: 0,
    quizCatFilter: 'الكل',
    quizAnswers: {},
    galleryLecFilter: 0,
    gallerySearch: '',
    lightboxList: [],
    lightboxIdx: 0
  };

  let activeCharts = [];
  function destroyCharts() {
    activeCharts.forEach(ch => { try { ch.destroy(); } catch (e) {} });
    activeCharts = [];
  }

  function saveProgress() {
    try {
      localStorage.setItem('bc2_completed_v1', JSON.stringify(Array.from(state.completedLectures)));
    } catch (e) {}
  }

  function showToast(msg) {
    const box = document.getElementById('toastBox');
    const txt = document.getElementById('toastMsg');
    if (!box || !txt) return;
    txt.textContent = msg;
    box.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => box.classList.add('hidden'), 2600);
  }

  function updateHeader() {
    const count = state.completedLectures.size;
    const pt = document.getElementById('progressText');
    if (pt) pt.textContent = `${count} / 7 مكتملة`;

    document.querySelectorAll('.nav-btn').forEach(btn => {
      const target = btn.getAttribute('data-nav');
      if (target === state.activeView) {
        btn.classList.add('tab-active');
        btn.classList.remove('text-slate-600', 'hover:bg-stone-100');
      } else {
        btn.classList.remove('tab-active');
        btn.classList.add('text-slate-600', 'hover:bg-stone-100');
      }
    });
    document.querySelectorAll('.nav-btn-mobile').forEach(btn => {
      const target = btn.getAttribute('data-nav');
      if (target === state.activeView) {
        btn.classList.add('bg-[#13294b]', 'text-white');
        btn.classList.remove('bg-stone-100', 'text-[#13294b]');
      } else {
        btn.classList.remove('bg-[#13294b]', 'text-white');
        btn.classList.add('bg-stone-100', 'text-[#13294b]');
      }
    });
  }

  function navigateTo(view, lectureId) {
    state.activeView = view;
    if (lectureId) state.activeLecture = lectureId;
    const mob = document.getElementById('mobileNav');
    if (mob) mob.classList.add('hidden');
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // VIEW 1: HOME
  // =========================================================================
  function renderHome() {
    const completedCount = state.completedLectures.size;
    const pct = Math.round((completedCount / 7) * 100);
    const quizAnswered = Object.keys(state.quizAnswers).length;
    const quizCorrect = Object.entries(state.quizAnswers).filter(([qid, ans]) => {
      const q = QUIZ_QUESTIONS.find(x => x.id === Number(qid));
      return q && q.ans === ans;
    }).length;

    return `
      <div class="space-y-8 fade-in">
        <!-- Hero Section -->
        <section class="card-elevated rounded-2xl overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div class="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-white">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#8a6a22] text-xs font-bold mb-4">
                  <i data-lucide="compass" class="w-3.5 h-3.5"></i>
                  قسم العمارة · كلية الهندسة · جامعة العاصمة
                </div>
                <h1 class="text-2xl sm:text-4xl font-extrabold text-[#13294b] leading-snug mb-3">
                  إنشاء مباني 2: الأنظمة الإنشائية للمباني
                </h1>
                <p class="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                  منصة تعليمية تفاعلية متكاملة تجمع المحاضرات السبع لمقرر <span class="font-semibold text-[#13294b]">Building Construction II</span> إعداد <span class="font-semibold text-[#13294b]">د. سيد مرعي منصور (Dr. Sayed M. Nagy)</span>، مزوّدة برسوم قطاعية تفاعلية، حاسبات أبعاد أولية، مختبر لاختيار النظام الإنشائي، وبنك اختبارات فوري.
                </p>
              </div>
              <div class="space-y-5">
                <div class="flex flex-wrap gap-3">
                  <button type="button" data-action="start-lec" data-lec="1" class="px-5 py-3 rounded-xl bg-[#13294b] text-white font-bold text-sm hover:bg-[#1f3f73] transition flex items-center gap-2 shadow-sm">
                    <i data-lucide="play-circle" class="w-4 h-4"></i>
                    ابدأ من المحاضرة الأولى
                  </button>
                  <button type="button" data-nav-jump="lab" class="px-5 py-3 rounded-xl bg-[#a8822f] text-white font-bold text-sm hover:bg-[#8a6a22] transition flex items-center gap-2 shadow-sm">
                    <i data-lucide="sliders" class="w-4 h-4"></i>
                    مختبر اختيار النظام الإنشائي
                  </button>
                </div>
                <!-- Progress Bar -->
                <div class="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <div class="flex items-center justify-between text-xs font-bold mb-2">
                    <span class="text-slate-600">تقدمك في المنهج</span>
                    <span class="text-[#13294b]">${completedCount} من 7 محاضرات (${pct}%) · الاختبار: ${quizCorrect}/${quizAnswered}</span>
                  </div>
                  <div class="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                    <div class="h-full bg-[#2c6a96] rounded-full transition-all duration-300" style="width:${pct}%"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:col-span-6 relative bg-[#f3efe6] flex items-center justify-center p-4 sm:p-6">
              <img src="img/isometric.jpg"
                   alt="قطاع إيزومتري معماري للأنظمة الإنشائية الخرسانية"
                   class="w-full h-auto max-h-[380px] object-cover rounded-xl shadow-md border border-stone-200" />
            </div>
          </div>
        </section>

        <!-- Quick Feature Highlights -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="card-elevated rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-slate-100 text-[#13294b] flex items-center justify-center shrink-0"><i data-lucide="layers" class="w-5 h-5"></i></div>
            <div><div class="text-lg font-extrabold text-[#13294b]">7 محاضرات</div><div class="text-xs text-slate-500">تغطية كاملة للمقرر</div></div>
          </div>
          <div class="card-elevated rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-orange-50 text-[#a8822f] flex items-center justify-center shrink-0"><i data-lucide="calculator" class="w-5 h-5"></i></div>
            <div><div class="text-lg font-extrabold text-[#13294b]">6 حاسبات</div><div class="text-xs text-slate-500">أحمال وأبعاد أولية</div></div>
          </div>
          <div class="card-elevated rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-teal-50 text-[#2c6a96] flex items-center justify-center shrink-0"><i data-lucide="drafting-compass" class="w-5 h-5"></i></div>
            <div><div class="text-lg font-extrabold text-[#13294b]">170 صورة</div><div class="text-xs text-slate-500">صور ومخططات المحاضرات</div></div>
          </div>
          <div class="card-elevated rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-amber-50 text-[#8a6a22] flex items-center justify-center shrink-0"><i data-lucide="check-square" class="w-5 h-5"></i></div>
            <div><div class="text-lg font-extrabold text-[#13294b]">70 سؤالاً</div><div class="text-xs text-slate-500">10 أسئلة لكل محاضرة</div></div>
          </div>
        </section>

        <!-- 7 Lectures Grid -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-extrabold text-[#13294b]">خريطة المحاضرات السبع</h2>
              <p class="text-xs sm:text-sm text-slate-500">اضغط على أي محاضرة للانتقال مباشرة إلى الشرح التفاعلي والأدوات الهندسية</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${LECTURES.map(lec => {
              const done = state.completedLectures.has(lec.id);
              return `
                <article class="card-elevated rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div>
                    <div class="relative h-40 bg-stone-100 overflow-hidden border-b border-stone-200">
                      <img src="${LECTURE_IMG_STORE[LECTURE_THUMBS[lec.id]] || ''}" alt="${lec.titleAr}" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition duration-300" />
                      <span class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-xs font-extrabold text-white shadow-sm" style="background:${lec.color}">محاضرة ${lec.num}</span>
                      <span class="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#13294b]/85 text-white backdrop-blur-sm">${(LECTURE_GALLERIES[lec.id] || []).length} صورة أصلية</span>
                    </div>
                    <div class="p-5 pb-0">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-slate-600">${lec.spanBadge}</span>
                    </div>
                    <h3 class="text-base font-extrabold text-[#13294b] mb-1">${lec.titleAr}</h3>
                    <div class="text-xs font-medium text-slate-400 mb-3 ltr-num">${lec.titleEn}</div>
                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">${lec.summary}</p>
                    </div>
                  </div>
                  <div class="flex items-center justify-between px-5 py-3 border-t border-stone-100 bg-stone-50/50">
                    <span class="text-xs font-bold ${done ? 'text-[#2c6a96]' : 'text-slate-400'} flex items-center gap-1">
                      <i data-lucide="${done ? 'check-circle-2' : 'circle'}" class="w-4 h-4"></i>
                      ${done ? 'مكتملة' : 'قيد الدراسة'}
                    </span>
                    <button type="button" data-action="start-lec" data-lec="${lec.id}" class="px-3.5 py-1.5 rounded-lg bg-[#13294b] text-white text-xs font-bold hover:bg-[#a8822f] transition">
                      فتح المحاضرة ←
                    </button>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </section>
      </div>
    `;
  }

  // =========================================================================
  // VIEW 2: LECTURES HUB
  // =========================================================================
  function renderLecturesShell() {
    const lec = LECTURES.find(l => l.id === state.activeLecture) || LECTURES[0];
    const isDone = state.completedLectures.has(lec.id);

    let bodyHtml = '';
    if (lec.id === 1) bodyHtml = renderLec1();
    else if (lec.id === 2) bodyHtml = renderLec2();
    else if (lec.id === 3) bodyHtml = renderLec3();
    else if (lec.id === 4) bodyHtml = renderLec4();
    else if (lec.id === 5) bodyHtml = renderLec5();
    else if (lec.id === 6) bodyHtml = renderLec6();
    else bodyHtml = renderLec7();

    return `
      <div class="space-y-6 fade-in">
        <!-- Lecture Switcher Pills -->
        <div class="bg-white border border-stone-200 rounded-2xl p-3 shadow-sm">
          <div class="flex flex-wrap gap-2">
            ${LECTURES.map(l => {
              const active = l.id === lec.id;
              const done = state.completedLectures.has(l.id);
              return `
                <button type="button" data-action="select-lec" data-lec="${l.id}"
                  class="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center gap-1.5 ${active ? 'lec-pill-active shadow-sm' : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'}">
                  <span>${l.num}. ${l.titleAr.split('(')[0].trim()}</span>
                  ${done ? `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#2c6a96]'}"></i>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Lecture Banner Header -->
        <div class="blueprint-dark text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
          <div>
            <div class="flex items-center gap-2 text-xs text-amber-300 font-bold mb-2">
              <span>المحاضرة ${lec.num} من 07</span>
              <span>•</span>
              <span>${lec.spanBadge}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold mb-1">${lec.titleAr}</h1>
            <div class="text-sm text-slate-300 ltr-num">${lec.titleEn}</div>
          </div>
          <div class="flex flex-wrap items-center gap-2.5">
            <button type="button" id="toggleCompleteBtn" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${isDone ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white/10 text-white border border-white/25 hover:bg-white/20'}">
              <i data-lucide="${isDone ? 'check-circle-2' : 'circle'}" class="w-4 h-4"></i>
              ${isDone ? 'تم إنجاز المحاضرة' : 'تحديد كمكتملة'}
            </button>
            ${lec.id < 7 ? `<button type="button" data-action="select-lec" data-lec="${lec.id + 1}" class="px-4 py-2.5 rounded-xl bg-[#a8822f] text-white text-xs sm:text-sm font-bold hover:bg-[#8a6a22] transition">المحاضرة التالية ←</button>` : ''}
          </div>
        </div>

        <!-- Interactive System Summary Tabs (Advantages / Disadvantages / Uses / Specs) -->
        ${(() => {
          const det = LECTURE_TABS_DATA[lec.id];
          const tabDefs = [
            { id: 'adv', label: 'المميزات (Advantages)', icon: 'thumbs-up', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { id: 'dis', label: 'العيوب والتحديات (Disadvantages)', icon: 'alert-triangle', badge: 'bg-red-50 text-red-700 border-red-200' },
            { id: 'uses', label: 'الاستخدامات في المباني (Uses)', icon: 'building', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
            { id: 'specs', label: 'أبرز المواصفات والأبعاد (Specs)', icon: 'ruler', badge: 'bg-slate-100 text-[#13294b] border-slate-200' }
          ];
          const activeT = tabDefs.find(t => t.id === state.lecDetailTab) || tabDefs[0];
          const items = det ? det[activeT.id] : [];
          return `
            <div class="card-elevated rounded-2xl p-5 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 class="text-base sm:text-lg font-extrabold text-[#13294b]">ملخص تفاعلي للمحاضرة ${lec.num}: المميزات والعيوب والاستخدامات والمواصفات</h2>
                  <p class="text-xs text-slate-500">تنقّل بين التبويبات لمراجعة النقاط الجوهرية للنظام ثم اختبر نفسك في 10 أسئلة مخصصة لهذه المحاضرة</p>
                </div>
                <button type="button" data-action="lec-quiz-jump" data-lec="${lec.id}"
                  class="px-4 py-2 rounded-xl bg-[#2c6a96] text-white text-xs font-bold hover:bg-[#1f4f73] transition flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                  <i data-lucide="help-circle" class="w-4 h-4"></i>
                  اختبار المحاضرة (10 أسئلة) ←
                </button>
              </div>
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                ${tabDefs.map(t => `
                  <button type="button" data-action="lec-detail-tab" data-tab="${t.id}"
                    class="px-3 py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${state.lecDetailTab === t.id ? 'bg-[#13294b] text-white border-[#13294b] shadow-sm' : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'}">
                    <i data-lucide="${t.icon}" class="w-3.5 h-3.5 shrink-0"></i>
                    <span class="truncate">${t.label.split('(')[0].trim()}</span>
                  </button>
                `).join('')}
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                ${items.map((txt, idx) => `
                  <div class="p-4 rounded-xl border ${activeT.badge} flex gap-3 items-start">
                    <span class="w-6 h-6 rounded-lg bg-white/80 font-extrabold text-xs flex items-center justify-center shrink-0 border border-current/20">${idx + 1}</span>
                    <p class="text-xs sm:text-sm leading-relaxed font-medium">${txt}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        })()}

        <!-- Lecture Interactive Content -->
        <div id="lectureContentArea" class="space-y-6">
          ${bodyHtml}
        </div>

        <!-- Original Lecture Images & Diagrams Gallery -->
        ${(() => {
          const imgs = LECTURE_GALLERIES[lec.id] || [];
          return `
            <section class="card-elevated rounded-2xl p-5 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 class="text-base sm:text-lg font-extrabold text-[#13294b] flex items-center gap-2">
                    <i data-lucide="images" class="w-5 h-5 text-[#a8822f]"></i>
                    صور ومخططات المحاضرة الأصلية (${imgs.length} صورة)
                  </h2>
                  <p class="text-xs text-slate-500">جميع الصور الفوتوغرافية والقطاعات والمخططات المستخرجة من ملف PowerPoint الأصلي — اضغط على أي صورة للتكبير والتنقل</p>
                </div>
                <button type="button" data-nav-jump="gallery" class="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#13294b] self-start sm:self-auto">
                  تصفح المعرض الكامل (${TOTAL_ORIGINAL_IMAGES}) ←
                </button>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                ${imgs.map((item, idx) => `
                  <button type="button" data-action="open-lb-lec" data-lec="${lec.id}" data-idx="${idx}"
                    class="group text-right bg-stone-50 border border-stone-200 rounded-xl overflow-hidden hover:border-[#a8822f] hover:shadow-md transition flex flex-col">
                    <div class="relative aspect-[4/3] w-full bg-white overflow-hidden">
                      <img src="${LECTURE_IMG_STORE[item.id] || ''}" alt="${item.caption}" loading="lazy"
                        class="w-full h-full object-contain p-1 group-hover:scale-105 transition duration-300" />
                      <span class="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-[#13294b]/85 text-white text-[10px] font-bold">شريحة ${item.slide}</span>
                    </div>
                    <div class="p-2.5 text-[11px] font-semibold text-slate-700 leading-snug line-clamp-2 border-t border-stone-200 bg-white w-full">${item.caption}</div>
                  </button>
                `).join('')}
              </div>
            </section>
          `;
        })()}
      </div>
    `;
  }

  // --- LECTURE 1 ---
  function getLoadSvg(type) {
    if (type === 'udl') {
      return `<svg viewBox="0 0 320 110" class="w-full h-28 svg-interactive">
        <rect x="40" y="65" width="240" height="12" fill="#13294b" rx="2"/>
        <polygon points="45,77 33,96 57,96" fill="#2c6a96"/>
        <polygon points="275,77 263,96 287,96" fill="#2c6a96"/>
        <line x1="40" y1="22" x2="280" y2="22" stroke="#a8822f" stroke-width="2.5"/>
        ${[55,95,135,175,215,255].map(x => `<line x1="${x}" y1="22" x2="${x}" y2="58" stroke="#a8822f" stroke-width="2"/><polygon points="${x},63 ${x-4},54 ${x+4},54" fill="#a8822f"/>`).join('')}
        <text x="160" y="15" text-anchor="middle" font-size="11" fill="#a8822f" font-weight="bold">w (kN/m)</text>
      </svg>`;
    }
    if (type === 'point') {
      return `<svg viewBox="0 0 320 110" class="w-full h-28 svg-interactive">
        <rect x="40" y="65" width="240" height="12" fill="#13294b" rx="2"/>
        <polygon points="45,77 33,96 57,96" fill="#2c6a96"/>
        <polygon points="275,77 263,96 287,96" fill="#2c6a96"/>
        <line x1="160" y1="16" x2="160" y2="56" stroke="#a8822f" stroke-width="3.5"/>
        <polygon points="160,64 153,52 167,52" fill="#a8822f"/>
        <text x="175" y="34" font-size="12" fill="#a8822f" font-weight="bold">P (kN)</text>
      </svg>`;
    }
    if (type === 'moment') {
      return `<svg viewBox="0 0 320 110" class="w-full h-28 svg-interactive">
        <rect x="40" y="65" width="240" height="12" fill="#13294b" rx="2"/>
        <polygon points="45,77 33,96 57,96" fill="#2c6a96"/>
        <polygon points="275,77 263,96 287,96" fill="#2c6a96"/>
        <path d="M 135 55 A 28 28 0 1 1 185 55" fill="none" stroke="#a8822f" stroke-width="3"/>
        <polygon points="187,58 179,48 190,46" fill="#a8822f"/>
        <text x="160" y="20" text-anchor="middle" font-size="12" fill="#a8822f" font-weight="bold">M (kN·m)</text>
      </svg>`;
    }
    if (type === 'wind') {
      return `<svg viewBox="0 0 320 110" class="w-full h-28 svg-interactive">
        <polygon points="110,95 110,45 190,22 190,55 245,55 245,95" fill="#e4dfd3" stroke="#13294b" stroke-width="2.5"/>
        <line x1="30" y1="95" x2="290" y2="95" stroke="#13294b" stroke-width="2"/>
        ${[52,70,86].map(y => `<line x1="55" y1="${y}" x2="100" y2="${y}" stroke="#2c6a96" stroke-width="2.2"/><polygon points="106,${y} 96,${y-4} 96,${y+4}" fill="#2c6a96"/>`).join('')}
        <text x="72" y="38" font-size="11" fill="#2c6a96" font-weight="bold">Wind Pressure</text>
      </svg>`;
    }
    if (type === 'axial') {
      return `<svg viewBox="0 0 320 110" class="w-full h-28 svg-interactive">
        <rect x="85" y="48" width="150" height="16" fill="#13294b" rx="2"/>
        <line x1="35" y1="56" x2="77" y2="56" stroke="#a8822f" stroke-width="3"/>
        <polygon points="83,56 72,50 72,62" fill="#a8822f"/>
        <line x1="285" y1="56" x2="243" y2="56" stroke="#a8822f" stroke-width="3"/>
        <polygon points="237,56 248,50 248,62" fill="#a8822f"/>
        <text x="160" y="34" text-anchor="middle" font-size="11" fill="#a8822f" font-weight="bold">Compression / Tension</text>
      </svg>`;
    }
    return `<svg viewBox="0 0 320 110" class="w-full h-28 svg-interactive">
      <rect x="40" y="58" width="240" height="12" fill="#13294b" rx="2"/>
      <line x1="120" y1="22" x2="120" y2="50" stroke="#a8822f" stroke-width="3"/>
      <polygon points="120,56 114,46 126,46" fill="#a8822f"/>
      <line x1="200" y1="96" x2="200" y2="76" stroke="#2c6a96" stroke-width="3"/>
      <polygon points="200,70 194,80 206,80" fill="#2c6a96"/>
      <text x="160" y="20" text-anchor="middle" font-size="11" fill="#13294b" font-weight="bold">Force Action</text>
    </svg>`;
  }

  function renderLec1() {
    const selectedLoad = STRUCTURAL_LOADS.find(l => l.id === state.selectedLoadId) || STRUCTURAL_LOADS[0];
    const deadRows = state.deadLayers.map((layer, idx) => {
      const calcVal = state.useSlideExact ? layer.slideLoad : Number(((layer.thickness / 1000) * layer.density * 9.81 / 1000).toFixed(2));
      return { ...layer, idx, load: calcVal };
    });
    const deadSum = deadRows.reduce((acc, r) => acc + r.load, 0);

    const cats = ['الكل', 'سكني', 'مستشفيات', 'مكاتب', 'ترفيهي', 'تجاري', 'مخازن', 'صناعي', 'مدارس'];
    const filteredLive = LIVE_LOADS_TABLE.filter(r => {
      const catOk = state.liveFilterCat === 'الكل' || r.cat === state.liveFilterCat;
      const q = state.liveSearch.trim().toLowerCase();
      const searchOk = !q || r.spaceAr.toLowerCase().includes(q) || r.spaceEn.toLowerCase().includes(q) || r.groupEn.toLowerCase().includes(q);
      return catOk && searchOk;
    });

    return `
      <!-- Definition & Scope -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="lg:col-span-2 card-elevated rounded-2xl p-6">
          <h2 class="text-lg font-extrabold text-[#13294b] mb-2">ما هو تشييد المباني؟ (What is Building Construction?)</h2>
          <p class="text-sm text-slate-600 leading-relaxed mb-4">
            تشييد المباني هو عملية إنشاء المنشآت المخصصة لاستخدام وسكن الإنسان، وتشمل أربع مراحل متكاملة: <strong>التصميم (Designing)</strong>، <strong>التخطيط (Planning)</strong>، <strong>توريد المواد (Procurement)</strong>، و<strong>التنفيذ (Execution)</strong>. تمتد المشاريع من المباني السكنية والتجارية (مكاتب، مدارس، مستشفيات، مراكز تسوق) إلى البنية التحتية (طرق، كباري، أنفاق، سدود، مطارات).
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div class="p-3 rounded-xl bg-stone-50 border border-stone-200"><div class="font-bold text-xs text-[#13294b]">1. التصميم</div><div class="text-[11px] text-slate-500">Designing</div></div>
            <div class="p-3 rounded-xl bg-stone-50 border border-stone-200"><div class="font-bold text-xs text-[#13294b]">2. التخطيط</div><div class="text-[11px] text-slate-500">Planning</div></div>
            <div class="p-3 rounded-xl bg-stone-50 border border-stone-200"><div class="font-bold text-xs text-[#13294b]">3. توريد المواد</div><div class="text-[11px] text-slate-500">Procurement</div></div>
            <div class="p-3 rounded-xl bg-stone-50 border border-stone-200"><div class="font-bold text-xs text-[#13294b]">4. التنفيذ</div><div class="text-[11px] text-slate-500">Execution</div></div>
          </div>
        </div>
        <div class="card-elevated rounded-2xl p-6 bg-amber-50/40">
          <h3 class="text-base font-extrabold text-[#13294b] mb-2">عوامل أحمال الرياح (Wind Loads)</h3>
          <p class="text-xs text-slate-600 mb-3">تؤثر الرياح على الأسقف المائلة والمسطحة والواجهات وفق أربعة عوامل رئيسية:</p>
          <ul class="space-y-2 text-xs font-semibold text-[#13294b]">
            <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#a8822f]"></span>ارتفاع المبنى (Building Height)</li>
            <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#a8822f]"></span>الشكل الهندسي للمنشأ (Geometry)</li>
            <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#a8822f]"></span>الموقع الجغرافي (Location)</li>
            <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#a8822f]"></span>اتجاه الرياح (Wind Direction)</li>
          </ul>
        </div>
      </div>

      <!-- 12 Structural Loads Interactive Explorer -->
      <div class="card-elevated rounded-2xl p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 class="text-lg font-extrabold text-[#13294b]">مستكشف الأحمال والتأثيرات الإنشائية الـ 12</h2>
            <p class="text-xs text-slate-500">اضغط على أي حمل لعرض تعريفه الدقيق والرسم التخطيطي لتأثيره</p>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div class="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${STRUCTURAL_LOADS.map(ld => {
              const active = ld.id === selectedLoad.id;
              return `
                <button type="button" data-action="select-load" data-id="${ld.id}"
                  class="p-2.5 rounded-xl border text-right transition ${active ? 'bg-[#13294b] text-white border-[#13294b] shadow-sm' : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'}">
                  <div class="text-xs font-bold leading-snug">${ld.nameAr}</div>
                  <div class="text-[10px] ${active ? 'text-slate-300' : 'text-slate-400'} truncate ltr-num">${ld.nameEn}</div>
                </button>
              `;
            }).join('')}
          </div>
          <div class="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-5">
            <div class="inline-block px-2.5 py-0.5 rounded-full bg-orange-100 text-[#a8822f] text-[11px] font-bold mb-2">${selectedLoad.cat}</div>
            <h3 class="text-base font-extrabold text-[#13294b]">${selectedLoad.nameAr}</h3>
            <div class="text-xs font-semibold text-slate-400 mb-3 ltr-num">${selectedLoad.nameEn}</div>
            <div class="bg-white rounded-xl border border-stone-200 p-2 mb-3">
              ${getLoadSvg(selectedLoad.svgType)}
            </div>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${selectedLoad.desc}</p>
          </div>
        </div>
      </div>

      <!-- Interactive Dead Load Floor Layer Calculator -->
      <div class="card-elevated rounded-2xl p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-lg font-extrabold text-[#13294b]">حاسبة الأحمال الميتة لطبقات الأرضية (Dead Loads Calculator)</h2>
            <p class="text-xs text-slate-500">مبنية على جدول المحاضرة الأولى — عدّل السمك أو الكثافة لملاحظة تغير الحمل الكلي فوراً</p>
          </div>
          <button type="button" id="resetDeadLoadBtn" class="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#13294b] transition self-start">
            استعادة مثال المحاضرة (6.85 kN/m²)
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-right border-collapse">
            <thead>
              <tr class="bg-stone-100 text-slate-700 text-xs">
                <th class="p-3 rounded-tr-xl">طبقة الأرضية (Floor Layer)</th>
                <th class="p-3">السمك [mm]</th>
                <th class="p-3">الكثافة [kg/m³]</th>
                <th class="p-3 rounded-tl-xl">الحمل المساحي [kN/m²]</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              ${deadRows.map(r => `
                <tr>
                  <td class="p-3 font-semibold text-[#13294b]">${r.nameAr}</td>
                  <td class="p-3"><input type="number" min="0" max="1000" step="5" data-dead-field="thickness" data-idx="${r.idx}" value="${r.thickness}" class="w-24 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-bold text-center ltr-num" /></td>
                  <td class="p-3"><input type="number" min="0" max="5000" step="10" data-dead-field="density" data-idx="${r.idx}" value="${r.density}" class="w-24 px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm font-bold text-center ltr-num" /></td>
                  <td class="p-3 font-extrabold text-[#a8822f] ltr-num">${r.load.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="bg-[#13294b] text-white font-extrabold">
                <td colspan="3" class="p-3.5 rounded-br-xl">إجمالي الحمل الميت (Total Dead Load)</td>
                <td class="p-3.5 rounded-bl-xl text-amber-300 text-base ltr-num">${deadSum.toFixed(2)} kN/m²</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Searchable Live Loads Table -->
      <div class="card-elevated rounded-2xl p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-lg font-extrabold text-[#13294b]">جدول الأحمال الحية حسب الإشغال (Live Loads Table)</h2>
            <p class="text-xs text-slate-500">البيانات المرجعية الكاملة من المحاضرة الأولى — ابحث أو صفِّ حسب نوع المبنى</p>
          </div>
          <input id="liveSearchInput" type="text" value="${state.liveSearch}" placeholder="ابحث (مثال: مكاتب، فصول، مخازن...)"
            class="px-3.5 py-2 rounded-xl border border-stone-300 text-sm w-full md:w-72 focus:outline-none focus:border-[#13294b]" />
        </div>
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${cats.map(c => `
            <button type="button" data-action="live-cat" data-cat="${c}"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${state.liveFilterCat === c ? 'bg-[#13294b] text-white' : 'bg-stone-100 text-slate-600 hover:bg-stone-200'}">${c}</button>
          `).join('')}
        </div>
        <div class="overflow-x-auto max-h-96 overflow-y-auto border border-stone-200 rounded-xl">
          <table class="w-full text-xs sm:text-sm text-right border-collapse">
            <thead class="sticky top-0 bg-stone-100 text-slate-700 z-10">
              <tr>
                <th class="p-3">التصنيف</th>
                <th class="p-3">الفراغ / الاستخدام</th>
                <th class="p-3">حمل منتظم psf (kN/m²)</th>
                <th class="p-3">حمل مركز lb (kN)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              ${filteredLive.map(r => `
                <tr class="hover:bg-stone-50">
                  <td class="p-3 font-bold text-[#2c6a96]">${r.cat}</td>
                  <td class="p-3">
                    <div class="font-semibold text-[#13294b]">${r.spaceAr}</div>
                    <div class="text-[11px] text-slate-400 ltr-num">${r.spaceEn}</div>
                  </td>
                  <td class="p-3 font-bold text-[#13294b] ltr-num">${r.uniform}</td>
                  <td class="p-3 text-slate-600 ltr-num">${r.conc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- LECTURE 2 ---
  function renderLec2() {
    const a = Math.max(0.5, Number(state.slabA) || 4);
    const b = Math.max(0.5, Number(state.slabB) || 6);
    const shortSide = Math.min(a, b);
    const longSide = Math.max(a, b);
    const ratio = longSide / shortSide;
    const isOneWay = ratio >= 2;

    const loadSteps = [
      { n: 1, title: '1. البلاطات (Slabs)', desc: 'عناصر أفقية مسطحة تستقبل الأحمال الميتة والحية مباشرة وتنقلها في اتجاه واحد أو اتجاهين إلى الكمرات.' },
      { n: 2, title: '2. الكمرات (Beams)', desc: 'عناصر أفقية (رئيسية وثانوية) تستقبل أحمال البلاطات والحوائط وتقاوم الانحناء والقص لتنقلها إلى الأعمدة.' },
      { n: 3, title: '3. الأعمدة (Columns)', desc: 'عناصر رأسية تتحمل الأحمال أساساً بالضغط (Compression) وتعد أخطر عنصر إنشائي لأن أمان المبنى يعتمد عليها.' },
      { n: 4, title: '4. القواعد (Footings)', desc: 'تنقل أحمال الأعمدة المجمعة وتوزعها بأمان على التربة دون حدوث هبوط غير متساوٍ.' }
    ];
    const activeStep = loadSteps.find(s => s.n === state.loadPathStep) || loadSteps[0];

    const beamTypes = [
      { id: 'simply', ar: 'كمرة بسيطة الارتكاز (Simply Supported)', desc: 'ترتكز على دعامتين عند الطرفين؛ الأكثر شيوعاً ومرونة في الإنشاءات التقليدية.' },
      { id: 'continuous', ar: 'كمرة مستمرة (Continuous Beam)', desc: 'تمتد على أكثر من دعامتين (ركيزتين أو أكثر)، وتعد أكثر اقتصادية لتقليل العزم الموجب في منتصف البحر.' },
      { id: 'cantilever', ar: 'كمرة كابولية (Cantilever Beam)', desc: 'مثبتة من طرف وحرة من الطرف الآخر، تتطلب تسليح "شوكة" يمتد للداخل مسافة 1.5 Lc لمقاومة العزم السالب.' },
      { id: 'overhanging', ar: 'كمرة ممتدة (Overhanging Beam)', desc: 'ترتكز على دعامتين وتمتد بجزء كابولي حر خارج إحدى الدعامتين أو كلتيهما.' },
      { id: 'fixed', ar: 'كمرة مثبتة الطرفين (Fixed Ended)', desc: 'مثبتة تثبيتاً كاملاً عند كلا الطرفين فتتولد عندهما عزوم سالبة وتقل قيمة الترخيم.' }
    ];
    const activeBeam = beamTypes.find(x => x.id === state.beamType) || beamTypes[0];

    return `
      <!-- Load Path Interactive Visualizer -->
      <div class="card-elevated rounded-2xl p-6">
        <h2 class="text-lg font-extrabold text-[#13294b] mb-1">مسار انتقال الأحمال في نظام الكمرات البسيطة (Load Path)</h2>
        <p class="text-xs text-slate-500 mb-4">اضغط على أي مرحلة لتتبع مسار القوى من السقف حتى التربة</p>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-6 bg-stone-50 border border-stone-200 rounded-xl p-4">
            <svg viewBox="0 0 360 220" class="w-full h-56 svg-interactive">
              <!-- Ground -->
              <rect x="20" y="192" width="320" height="16" fill="#e4dfd3" rx="3"/>
              <!-- Footings -->
              <rect x="55" y="168" width="70" height="24" fill="${state.loadPathStep===4?'#a8822f':'#5b6575'}" rx="3"/>
              <rect x="235" y="168" width="70" height="24" fill="${state.loadPathStep===4?'#a8822f':'#5b6575'}" rx="3"/>
              <!-- Columns -->
              <rect x="78" y="84" width="24" height="84" fill="${state.loadPathStep===3?'#a8822f':'#4a5465'}"/>
              <rect x="258" y="84" width="24" height="84" fill="${state.loadPathStep===3?'#a8822f':'#4a5465'}"/>
              <!-- Beam -->
              <rect x="65" y="66" width="230" height="20" fill="${state.loadPathStep===2?'#a8822f':'#13294b'}" rx="2"/>
              <!-- Slab -->
              <rect x="45" y="50" width="270" height="16" fill="${state.loadPathStep===1?'#a8822f':'#2c6a96'}" rx="2"/>
              <!-- Gravity Arrow -->
              <line x1="180" y1="12" x2="180" y2="42" stroke="#a8822f" stroke-width="4"/>
              <polygon points="180,48 172,36 188,36" fill="#a8822f"/>
              <text x="180" y="61" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">1. Slab</text>
              <text x="180" y="80" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">2. Beam</text>
              <text x="90" y="130" text-anchor="middle" fill="#FFF" font-size="10" font-weight="bold">3. Col</text>
              <text x="270" y="130" text-anchor="middle" fill="#FFF" font-size="10" font-weight="bold">3. Col</text>
              <text x="90" y="184" text-anchor="middle" fill="#FFF" font-size="10" font-weight="bold">4. Footing</text>
              <text x="270" y="184" text-anchor="middle" fill="#FFF" font-size="10" font-weight="bold">4. Footing</text>
            </svg>
          </div>
          <div class="lg:col-span-6 space-y-2.5">
            ${loadSteps.map(s => `
              <button type="button" data-action="load-step" data-step="${s.n}"
                class="w-full text-right p-3.5 rounded-xl border transition ${state.loadPathStep===s.n ? 'bg-[#13294b] text-white border-[#13294b] shadow-sm' : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-50'}">
                <div class="font-bold text-sm mb-1">${s.title}</div>
                <div class="text-xs ${state.loadPathStep===s.n ? 'text-slate-200' : 'text-slate-500'}">${s.desc}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- One-Way vs Two-Way Interactive Slab Checker -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 card-elevated rounded-2xl p-6">
          <h2 class="text-lg font-extrabold text-[#13294b] mb-1">فاحص البلاطات التفاعلي: One-Way أم Two-Way؟</h2>
          <p class="text-xs text-slate-500 mb-4">أدخل أبعاد الغرفة <span class="ltr-num">(a, b)</span> للتحقق من نسبة الاستطالة <span class="ltr-num">b/a</span> وتوزيع الأحمال</p>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">البعد الأول a (متر)</label>
              <input id="slabAInput" type="number" step="0.5" min="1" max="15" value="${state.slabA}" class="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold ltr-num" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">البعد الثاني b (متر)</label>
              <input id="slabBInput" type="number" step="0.5" min="1" max="15" value="${state.slabB}" class="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold ltr-num" />
            </div>
          </div>
          <div class="p-4 rounded-xl border ${isOneWay ? 'bg-amber-50 border-amber-200' : 'bg-teal-50 border-teal-200'} mb-4">
            <div class="flex items-center justify-between">
              <div class="font-extrabold text-base ${isOneWay ? 'text-[#8a6a22]' : 'text-[#2c6a96]'}">
                ${isOneWay ? 'بلاطة ذات اتجاه واحد (One-Way Slab)' : 'بلاطة ذات اتجاهين (Two-Way Slab)'}
              </div>
              <span class="px-2.5 py-1 rounded-lg bg-white text-xs font-extrabold text-[#13294b] ltr-num">b/a = ${ratio.toFixed(2)} ${isOneWay ? '≥ 2' : '< 2'}</span>
            </div>
            <p class="text-xs text-slate-600 mt-2">
              ${isOneWay ? 'تنتقل الأحمال أساساً في الاتجاه القصير (' + shortSide + ' م) نحو الكمرات الطويلة.' : 'تتوزع الأحمال في كلا الاتجاهين (' + shortSide + ' م و ' + longSide + ' م) نحو الكمرات الأربعة المحيطة.'}
            </p>
          </div>
          <!-- Live SVG Slab Plan -->
          <div class="bg-stone-50 border border-stone-200 rounded-xl p-4 flex justify-center">
            <svg viewBox="0 0 300 170" class="w-full max-w-sm h-40 svg-interactive">
              ${(() => {
                const wPx = isOneWay ? 220 : Math.min(200, Math.max(120, 120 * ratio));
                const hPx = isOneWay ? Math.max(68, Math.min(105, 220 / ratio)) : 120;
                const x0 = (300 - wPx) / 2;
                const y0 = (170 - hPx) / 2;
                let arrows = '';
                if (isOneWay) {
                  for (let k = 1; k <= 3; k++) {
                    const ax = x0 + (wPx * k) / 4;
                    arrows += `<line x1="${ax}" y1="${y0+12}" x2="${ax}" y2="${y0+hPx-12}" stroke="#a8822f" stroke-width="2.2"/>
                               <polygon points="${ax},${y0+7} ${ax-4},${y0+15} ${ax+4},${y0+15}" fill="#a8822f"/>
                               <polygon points="${ax},${y0+hPx-7} ${ax-4},${y0+hPx-15} ${ax+4},${y0+hPx-15}" fill="#a8822f"/>`;
                  }
                } else {
                  const cx = 150, cy = 85;
                  arrows = `
                    <line x1="${x0}" y1="${y0}" x2="${x0+wPx}" y2="${y0+hPx}" stroke="#9aa4b5" stroke-dasharray="4 3" stroke-width="1.2"/>
                    <line x1="${x0+wPx}" y1="${y0}" x2="${x0}" y2="${y0+hPx}" stroke="#9aa4b5" stroke-dasharray="4 3" stroke-width="1.2"/>
                    <line x1="${cx}" y1="${y0+14}" x2="${cx}" y2="${y0+hPx-14}" stroke="#2c6a96" stroke-width="2.5"/>
                    <line x1="${x0+14}" y1="${cy}" x2="${x0+wPx-14}" y2="${cy}" stroke="#2c6a96" stroke-width="2.5"/>
                  `;
                }
                return `
                  <rect x="${x0}" y="${y0}" width="${wPx}" height="${hPx}" fill="#FFFFFF" stroke="#13294b" stroke-width="3"/>
                  <rect x="${x0-5}" y="${y0-5}" width="10" height="10" fill="#13294b"/>
                  <rect x="${x0+wPx-5}" y="${y0-5}" width="10" height="10" fill="#13294b"/>
                  <rect x="${x0-5}" y="${y0+hPx-5}" width="10" height="10" fill="#13294b"/>
                  <rect x="${x0+wPx-5}" y="${y0+hPx-5}" width="10" height="10" fill="#13294b"/>
                  ${arrows}
                  <text x="150" y="${y0-10}" text-anchor="middle" font-size="11" fill="#13294b" font-weight="bold">${longSide} m</text>
                  <text x="${x0-16}" y="88" text-anchor="middle" font-size="11" fill="#13294b" font-weight="bold">${shortSide} m</text>
                `;
              })()}
            </svg>
          </div>
        </div>

        <!-- Beam Types & Details -->
        <div class="lg:col-span-5 card-elevated rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 class="text-lg font-extrabold text-[#13294b] mb-3">أنواع الكمرات وتفاصيل التنفيذ</h2>
            <div class="flex flex-wrap gap-1.5 mb-3">
              ${beamTypes.map(bt => `
                <button type="button" data-action="beam-type" data-id="${bt.id}"
                  class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${state.beamType===bt.id ? 'bg-[#a8822f] text-white' : 'bg-stone-100 text-slate-600 hover:bg-stone-200'}">${bt.ar.split('(')[0].trim()}</button>
              `).join('')}
            </div>
            <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 mb-4">
              <div class="font-bold text-sm text-[#13294b] mb-1">${activeBeam.ar}</div>
              <p class="text-xs text-slate-600 leading-relaxed">${activeBeam.desc}</p>
            </div>
            <div class="space-y-2.5 text-xs text-slate-600">
              <div class="p-3 rounded-xl bg-white border border-stone-200">
                <span class="font-bold text-[#13294b]">علاقة عرض الكمرة بالحائط:</span> يكون عرض الكمرة مساوياً لسمك الحائط (<span class="ltr-num font-bold">b = t</span>) أو أكبر منه (<span class="ltr-num font-bold">b ≥ t</span>)، ويمكن دمج الكمرة لتعمل كـ <strong>كمرة وعتب في آن واحد</strong> فوق الفتحات.
              </div>
              <div class="p-3 rounded-xl bg-white border border-stone-200">
                <span class="font-bold text-[#13294b]">أحمال الأعمدة ومقاومة الانبعاج:</span> يحمل العمود وزنه الذاتي × عدد الأدوار + وزن الكمرات + وزن الحوائط + إجمالي أحمال البلاطة، وتقلل الكمرات العرضية طول الانبعاج (Buckling).
              </div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500">تمرين المحاضرة: غرفة 6×4 م و 5×3 م</span>
            <button type="button" data-action="try-preset" data-l="6" data-w="4" class="text-xs font-bold text-[#a8822f] hover:underline">جرّب في المختبر ←</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- LECTURE 3 ---
  function renderLec3() {
    const span = Number(state.flatSpan) || 7.5;
    const isDrop = state.flatType === 'drop' || state.flatType === 'both';
    const isCap = state.flatType === 'capital' || state.flatType === 'both';
    const divisor = isDrop ? 36 : 33;
    const slabCm = Math.max(15, Math.ceil((span * 100) / divisor));
    const dropWidthM = (span / 3).toFixed(2);
    const dropDepthCm = (slabCm * 0.25).toFixed(1);

    const flatOpts = [
      { id: 'plate', ar: 'بلاطة مسطحة (Flat Plate)', note: 'سقف أملس بالكامل بدون سقوط أو تاج؛ مناسب للأحمال الخفيفة والبحور المتوسطة، معادلة السمك Span/33.' },
      { id: 'drop', ar: 'بسقوط بلاطة (Drop Panel)', note: 'زيادة محلية في سمك البلاطة فوق الأعمدة (بعرض ≥ 1/3 البحر وسمك 0.25×سمك البلاطة) لمقاومة القص الثاقب والعزم السالب.' },
      { id: 'capital', ar: 'بتاج عمود (Column Capital)', note: 'توسيع مخروطي لأعلى العمود لزيادة محيط القص الحرج وتقليل البحر الصافي.' },
      { id: 'both', ar: 'بسقوط + تاج عمود (Both)', note: 'أعلى مقاومة للقص الثاقب (Punching Shear) ومناسب للأحمال الثقيلة والبحور الكبيرة.' }
    ];
    const activeOpt = flatOpts.find(o => o.id === state.flatType) || flatOpts[3];

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 4-Type Interactive Flat Slab SVG + Selector -->
        <div class="lg:col-span-7 card-elevated rounded-2xl p-6">
          <h2 class="text-lg font-extrabold text-[#13294b] mb-1">أنواع البلاطات اللاكمرية ومقاومة القص الثاقب (Punching Shear)</h2>
          <p class="text-xs text-slate-500 mb-4">بدّل بين الأنواع الأربعة لملاحظة التغير في القطاع الإنشائي فوق العمود</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            ${flatOpts.map(o => `
              <button type="button" data-action="flat-type" data-id="${o.id}"
                class="p-2.5 rounded-xl text-xs font-bold border transition ${state.flatType===o.id ? 'bg-[#a8822f] text-white border-[#a8822f]' : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'}">${o.ar.split('(')[0].trim()}</button>
            `).join('')}
          </div>
          <div class="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4">
            <svg viewBox="0 0 360 190" class="w-full h-48 svg-interactive">
              <!-- Slab -->
              <rect x="20" y="34" width="320" height="24" fill="#13294b" rx="2"/>
              <!-- Drop Panel -->
              ${isDrop ? `<rect x="115" y="58" width="130" height="16" fill="#a8822f" rx="1"/>` : ''}
              <!-- Column Capital -->
              ${isCap ? `<polygon points="135,${isDrop?74:58} 225,${isDrop?74:58} 200,${isDrop?104:88} 160,${isDrop?104:88}" fill="#2c6a96"/>` : ''}
              <!-- Column -->
              <rect x="160" y="${isCap?(isDrop?104:88):(isDrop?74:58)}" width="40" height="100" fill="#4a5465"/>
              <!-- Punching Shear Dashed Lines -->
              <line x1="145" y1="34" x2="122" y2="58" stroke="#d2b06a" stroke-width="2" stroke-dasharray="4 2"/>
              <line x1="215" y1="34" x2="238" y2="58" stroke="#d2b06a" stroke-width="2" stroke-dasharray="4 2"/>
              <text x="180" y="24" text-anchor="middle" font-size="11" fill="#13294b" font-weight="bold">Flat Slab (ts = ${slabCm} cm)</text>
              ${isDrop ? `<text x="295" y="70" text-anchor="middle" font-size="10" fill="#a8822f" font-weight="bold">Drop Panel (≥ L/3)</text>` : ''}
              ${isCap ? `<text x="295" y="96" text-anchor="middle" font-size="10" fill="#2c6a96" font-weight="bold">Column Capital</text>` : ''}
              <text x="68" y="82" text-anchor="middle" font-size="10" fill="#8a6a22" font-weight="bold">Punching Zone</text>
            </svg>
          </div>
          <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-700 leading-relaxed">
            <strong>${activeOpt.ar}:</strong> ${activeOpt.note}
          </div>
        </div>

        <!-- Sizing Calculator & Height Comparison -->
        <div class="lg:col-span-5 space-y-5">
          <div class="card-elevated rounded-2xl p-6">
            <h3 class="text-base font-extrabold text-[#13294b] mb-2">حاسبة الأبعاد الأولية للفلات سلاب</h3>
            <div class="mb-4">
              <div class="flex justify-between text-xs font-bold mb-1">
                <span>البحر بين الأعمدة (Span)</span>
                <span class="text-[#a8822f] ltr-num">${span.toFixed(1)} m</span>
              </div>
              <input id="flatSpanSlider" type="range" min="3.5" max="14" step="0.5" value="${span}" class="w-full" />
              <div class="flex justify-between text-[10px] text-slate-400 ltr-num"><span>3.05 m (Conv.)</span><span>12.19 m</span><span>14.33 m (PT)</span></div>
            </div>
            <div class="grid grid-cols-2 gap-3 text-center">
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">سمك البلاطة (Span/${divisor})</div>
                <div class="text-xl font-extrabold text-[#13294b] ltr-num">${slabCm} cm</div>
              </div>
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">عرض السقوط (≥ L/3)</div>
                <div class="text-xl font-extrabold text-[#a8822f] ltr-num">${isDrop ? dropWidthM + ' m' : 'غير مستخدم'}</div>
              </div>
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">سمك السقوط (0.25×ts)</div>
                <div class="text-lg font-extrabold text-[#2c6a96] ltr-num">${isDrop ? '+' + dropDepthCm + ' cm' : '—'}</div>
              </div>
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">مقاس العمود المقترح</div>
                <div class="text-lg font-extrabold text-[#13294b] ltr-num">${isDrop ? '30–61 cm' : '30–81 cm'}</div>
              </div>
            </div>
          </div>

          <div class="card-elevated rounded-2xl p-5 bg-[#13294b] text-white">
            <h3 class="text-sm font-extrabold text-amber-300 mb-2">ميزة توفير الارتفاع الإنشائي (Clear Height Gain)</h3>
            <p class="text-xs text-slate-200 leading-relaxed mb-3">
              لتحقيق ارتفاع صافي <strong>2.8 م</strong>: يحتاج النظام التقليدي ذو الكمرات الساقطة إلى ارتفاع دور إجمالي <strong>3.4 م</strong>، بينما يحقق نظام الفلات سلاب نفس الارتفاع الصافي بارتفاع دور <strong>3.2 م</strong> فقط (توفير 20 سم لكل دور + سهولة تمرير التكييف والكهرباء).
            </p>
            <button type="button" data-action="try-preset" data-l="9" data-w="6" class="text-xs font-bold text-amber-300 hover:underline">تطبيق تمرين المحاضرة (صالة 6×9 م) في المختبر ←</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- LECTURE 4 ---
  function renderLec4() {
    const blk = HB_BLOCKS.find(b => b.id === state.hbBlockId) || HB_BLOCKS[1];
    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Code Requirements & Cross-Section -->
        <div class="lg:col-span-7 card-elevated rounded-2xl p-6">
          <h2 class="text-lg font-extrabold text-[#13294b] mb-1">مكونات السقف الهوردي واشتراطات الكود</h2>
          <p class="text-xs text-slate-500 mb-4">الأبعاد القياسية والعملية للبلاطة ذات الأعصاب والبلوكات المفرغة (Hollow Block Slab)</p>
          <div class="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4">
            <svg viewBox="0 0 380 155" class="w-full h-40 svg-interactive">
              <!-- Topping slab -->
              <rect x="20" y="25" width="340" height="22" fill="#13294b"/>
              <!-- Projected Beam on right -->
              <rect x="315" y="47" width="45" height="82" fill="#13294b"/>
              <!-- Solid Part X -->
              <rect x="275" y="47" width="40" height="50" fill="#4a5465"/>
              <!-- Ribs & Blocks -->
              <rect x="35" y="47" width="60" height="50" fill="#e4dfd3" stroke="#a8822f" stroke-width="2"/>
              <line x1="35" y1="47" x2="95" y2="97" stroke="#a8822f" stroke-width="1"/>
              <line x1="95" y1="47" x2="35" y2="97" stroke="#a8822f" stroke-width="1"/>
              <rect x="95" y="47" width="22" height="50" fill="#13294b"/>
              <rect x="117" y="47" width="60" height="50" fill="#e4dfd3" stroke="#a8822f" stroke-width="2"/>
              <line x1="117" y1="47" x2="177" y2="97" stroke="#a8822f" stroke-width="1"/>
              <line x1="177" y1="47" x2="117" y2="97" stroke="#a8822f" stroke-width="1"/>
              <rect x="177" y="47" width="22" height="50" fill="#13294b"/>
              <rect x="199" y="47" width="60" height="50" fill="#e4dfd3" stroke="#a8822f" stroke-width="2"/>
              <line x1="199" y1="47" x2="259" y2="97" stroke="#a8822f" stroke-width="1"/>
              <line x1="259" y1="47" x2="199" y2="97" stroke="#a8822f" stroke-width="1"/>
              <rect x="259" y="47" width="16" height="50" fill="#13294b"/>
              <!-- Labels -->
              <text x="180" y="18" text-anchor="middle" font-size="11" fill="#13294b" font-weight="bold">Topping Slab ts (50–70 mm)</text>
              <text x="65" y="116" text-anchor="middle" font-size="10" fill="#a8822f" font-weight="bold">e = 400 mm</text>
              <text x="106" y="132" text-anchor="middle" font-size="10" fill="#13294b" font-weight="bold">b=100</text>
              <text x="295" y="116" text-anchor="middle" font-size="10" fill="#2c6a96" font-weight="bold">X ≥ 150</text>
              <text x="338" y="144" text-anchor="middle" font-size="10" fill="#13294b" font-weight="bold">Beam</text>
            </svg>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-white border border-stone-200">
              <div class="font-extrabold text-[#a8822f] mb-1.5">اشتراطات الكود (Code Limits)</div>
              <ul class="space-y-1 text-slate-600">
                <li>• عرض البلوك <span class="ltr-num font-bold">e ≤ 700 mm</span></li>
                <li>• عرض العصب <span class="ltr-num font-bold">b ≥ max(100 mm, t/3)</span></li>
                <li>• سمك البلاطة العلوية <span class="ltr-num font-bold">ts ≥ max(50 mm, e/10)</span></li>
                <li>• الجزء المصمت <span class="ltr-num font-bold">X ≥ 150 mm</span></li>
              </ul>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-stone-200">
              <div class="font-extrabold text-[#2c6a96] mb-1.5">القيم العملية في الموقع</div>
              <ul class="space-y-1 text-slate-600">
                <li>• <span class="ltr-num font-bold">e = 400 mm, b = 100 mm, S = 500 mm</span></li>
                <li>• ارتفاع البلوك <span class="ltr-num font-bold">h = 150 / 200 / 250 mm</span></li>
                <li>• <span class="ltr-num font-bold">ts = 50 / 60 / 70 mm</span> و <span class="ltr-num font-bold">t = h + ts</span></li>
                <li>• <strong>ملاحظة تنفيذية:</strong> يوضع آخر بلوك معكوساً لمنع دخول الخرسانة داخله.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Egyptian Market Blocks Comparator + Chart -->
        <div class="lg:col-span-5 card-elevated rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-extrabold text-[#13294b] mb-2">مقارنة بلوكات السوق المصري (kN/m²)</h3>
            <div class="flex flex-wrap gap-1.5 mb-3">
              ${HB_BLOCKS.map(b => `
                <button type="button" data-action="hb-block" data-id="${b.id}"
                  class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${state.hbBlockId===b.id ? 'bg-[#13294b] text-white' : 'bg-stone-100 text-slate-600 hover:bg-stone-200'}">${b.nameAr}</button>
              `).join('')}
            </div>
            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5 mb-4">
              <div class="flex justify-between font-bold text-[#13294b]"><span>${blk.nameAr} (${blk.dims})</span><span class="text-[#a8822f]">${blk.weightKg}</span></div>
              <div><strong class="text-[#2c6a96]">المميزات:</strong> ${blk.pros}</div>
              <div><strong class="text-[#8a6a22]">العيوب:</strong> ${blk.cons}</div>
              <div class="pt-1 flex gap-4 font-extrabold text-[#13294b] ltr-num">
                <span>One-Way: ${blk.oneWay} kN/m²</span>
                <span>Two-Way: ${blk.twoWay} kN/m²</span>
              </div>
            </div>
            <div class="relative h-52">
              <canvas id="hbChart"></canvas>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500">تمرين 3: صالة 7×9 م</span>
            <button type="button" data-action="try-preset" data-l="9" data-w="7" class="text-xs font-bold text-[#a8822f] hover:underline">جرّب في المختبر ←</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- LECTURE 5 ---
  function renderLec5() {
    const span = Number(state.waffleSpan) || 12;
    const depthCm = Math.max(25, Math.ceil((span * 100) / 24));
    const isPT = span > 16.76;
    const mod = Number(state.waffleModule) || 60;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 card-elevated rounded-2xl p-6">
          <h2 class="text-lg font-extrabold text-[#13294b] mb-1">نظام البلاطات الشبكية (Waffle Slab System)</h2>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            بلاطة خرسانية مسلحة ذات اتجاهين (Two-Way Ribbed Slab) تشبه شبكة "الوافل"، تتميز بسطح علوي مستوٍ وتجاويف منتظمة في السطح السفلي تقلل وزن الخرسانة وتتيح بحوراً كبيرة جداً دون أعمدة داخلية، مع إزالة القوالب حول الأعمدة لتكوين منطقة مصمتة.
          </p>
          <!-- Interactive Waffle Plan Grid SVG -->
          <div class="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4">
            <div class="flex items-center justify-between mb-2 text-xs font-bold text-[#13294b]">
              <span>مسقط أفقي تخطيطي لوحدة الوافل (Module: ${mod}×${mod} cm)</span>
              <span class="text-[#a8822f]">إزالة القوالب عند الأعمدة (Solid Head)</span>
            </div>
            <svg viewBox="0 0 360 180" class="w-full h-44 svg-interactive">
              <rect x="20" y="10" width="320" height="160" fill="#13294b" rx="4"/>
              ${(() => {
                let cells = '';
                const cols = 10, rows = 5;
                const cw = 28, ch = 26, gap = 3;
                for (let r = 0; r < rows; r++) {
                  for (let c = 0; c < cols; c++) {
                    const isCorner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
                    const x = 26 + c * (cw + gap);
                    const y = 16 + r * (ch + gap);
                    if (isCorner) {
                      cells += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="#a8822f" rx="2"/>
                                <rect x="${x+9}" y="${y+8}" width="10" height="10" fill="#FFFFFF"/>`;
                    } else {
                      cells += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="#e4dfd3" rx="2"/>`;
                    }
                  }
                }
                return cells;
              })()}
            </svg>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-white border border-stone-200">
              <div class="font-extrabold text-[#13294b] mb-1">أمثلة معمارية عالمية من المحاضرة</div>
              <p class="text-slate-600">• <strong>Free Education Unit (سريلانكا):</strong> أعمدة متقاطعة + بلاطة وافل لتقليل الخرسانة وفتحات تهوية.<br>• <strong>مبنى فانكوفر (كندا):</strong> استخدام قوالب الفايبرجلاس/البلاستيك المفرغة القابلة لإعادة الاستخدام.</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-stone-200">
              <div class="font-extrabold text-[#2c6a96] mb-1">المزايا الرئيسية</div>
              <p class="text-slate-600">قوة إنشائية عالية للبحور الكبيرة (مسارح وجراجات)، تقليل الترخيم، شكل معماري مكشوف للسقف، وسهولة توزيع وحدات الإضاءة والخدمات داخل التجاويف.</p>
            </div>
          </div>
        </div>

        <!-- Waffle Calculator -->
        <div class="lg:col-span-5 card-elevated rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-extrabold text-[#13294b] mb-3">حاسبة أبعاد Waffle Slab (Span/24)</h3>
            <div class="space-y-4 mb-5">
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>البحر المطلوب (Span)</span>
                  <span class="text-[#a8822f] ltr-num">${span.toFixed(1)} m</span>
                </div>
                <input id="waffleSpanSlider" type="range" min="7" max="24" step="0.5" value="${span}" class="w-full" />
                <div class="flex justify-between text-[10px] text-slate-400 ltr-num"><span>7.6 m (Conv.)</span><span>16.8 m</span><span>24.4 m (PT)</span></div>
              </div>
              <div>
                <div class="text-xs font-bold text-slate-600 mb-1.5">مقاس القالب (Module / Dome)</div>
                <div class="grid grid-cols-4 gap-2">
                  ${[48, 60, 76, 90].map(m => `
                    <button type="button" data-action="waffle-mod" data-mod="${m}"
                      class="py-1.5 rounded-lg text-xs font-bold border ltr-num ${mod===m ? 'bg-[#13294b] text-white border-[#13294b]' : 'bg-stone-50 text-slate-700 border-stone-200'}">${m}×${m}</button>
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 text-center">
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">عمق البلاطة (Span/24)</div>
                <div class="text-xl font-extrabold text-[#13294b] ltr-num">${depthCm} cm</div>
              </div>
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">التقنية الموصى بها</div>
                <div class="text-sm font-extrabold ${isPT ? 'text-[#a8822f]' : 'text-[#2c6a96]'} mt-1">${isPT ? 'شد لاحق (Post-Tensioned)' : 'خرسانة مسلحة تقليدية'}</div>
              </div>
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">عرض الأعصاب (Ribs)</div>
                <div class="text-base font-extrabold text-[#13294b] ltr-num">12.5 – 15 cm</div>
              </div>
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">مقاس الأعمدة</div>
                <div class="text-base font-extrabold text-[#13294b] ltr-num">61 – 101.6 cm</div>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500">تمرين 4: صالة 10×14 م</span>
            <button type="button" data-action="try-preset" data-l="14" data-w="10" class="text-xs font-bold text-[#a8822f] hover:underline">جرّب في المختبر ←</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- LECTURE 6 ---
  function renderLec6() {
    const L = Math.max(4, Number(state.pbL) || 12);
    const Ls = Math.max(4, Number(state.pbLs) || 10);
    const big = Math.max(L, Ls);
    const small = Math.min(L, Ls);
    const ratio = big / small;
    const ratioOk = ratio <= 4 / 3 + 0.001;
    const area = big * small;
    const mainDepthMm = Math.ceil((small * 1000 / 16) / 50) * 50;
    const innerDepthMm = Math.ceil((small * 1000 / 24) / 50) * 50;
    const slabCm = Math.max(10, Math.round((small * 100) / 40));

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Paneled Beam Calculator -->
        <div class="lg:col-span-7 card-elevated rounded-2xl p-6">
          <h2 class="text-lg font-extrabold text-[#13294b] mb-1">حاسبة نظام الكمرات المتقاطعة (Paneled Beams)</h2>
          <p class="text-xs text-slate-500 mb-4">أدخل أبعاد الصالة للتحقق من شرط العمل الشبكي (<span class="ltr-num">L/Ls ≤ 4/3</span>) وحساب قطاعات الكمرات الرئيسية والداخلية</p>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">الطول L (متر)</label>
              <input id="pbLInput" type="number" step="0.5" min="6" max="20" value="${L}" class="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold ltr-num" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">العرض Ls (متر)</label>
              <input id="pbLsInput" type="number" step="0.5" min="6" max="20" value="${Ls}" class="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold ltr-num" />
            </div>
          </div>

          <div class="p-3.5 rounded-xl border mb-4 ${ratioOk ? 'bg-teal-50 border-teal-200 text-[#2c6a96]' : 'bg-red-50 border-red-200 text-red-700'} text-xs font-bold flex flex-wrap items-center justify-between gap-2">
            <span>نسبة الأبعاد <span class="ltr-num">L/Ls = ${ratio.toFixed(2)}</span> — ${ratioOk ? 'مطابق لشرط العمل الشبكي (≤ 1.33)' : 'يتجاوز 4/3 (يُفضل إضافة أعمدة طرفية أو استخدام Skew / Frames)'}</span>
            <span class="ltr-num">المساحة: ${area.toFixed(0)} m² ${area > 150 ? '(تحتاج Paneled Frames)' : '(مناسب لـ Paneled Beams)'}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center mb-4">
            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div class="text-[11px] text-slate-500">الكمرة الخارجية (B3, B4)</div>
              <div class="text-lg font-extrabold text-[#13294b] ltr-num">250–300 × ${mainDepthMm} mm</div>
              <div class="text-[10px] text-slate-400">Ls / 16 مقرباً لأقرب 5 سم</div>
            </div>
            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div class="text-[11px] text-slate-500">الكمرة الداخلية (B1, B2)</div>
              <div class="text-lg font-extrabold text-[#a8822f] ltr-num">150–250 × ${innerDepthMm} mm</div>
              <div class="text-[10px] text-slate-400">Ls / 24 مقرباً لأقرب 5 سم</div>
            </div>
            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div class="text-[11px] text-slate-500">سمك البلاطة (ts)</div>
              <div class="text-lg font-extrabold text-[#2c6a96] ltr-num">~${slabCm} cm</div>
              <div class="text-[10px] text-slate-400">Ls / (35 – 45)</div>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 leading-relaxed">
            <strong>اشتراطات معمارية وإنشائية مهمة:</strong> يفضل أن تتراوح المسافات بين الكمرات الداخلية (<span class="ltr-num">a, b</span>) بين <strong>2.0 إلى 5.0 م</strong>، ولا يجوز وضع حوائط على الكمرات الداخلية، ويجب أن تكون الكمرات الخارجية أكبر قطاعاً من الداخلية.
          </div>
        </div>

        <!-- Types & Assiut Case Study -->
        <div class="lg:col-span-5 card-elevated rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-extrabold text-[#13294b] mb-2">أنواع الكمرات المتقاطعة</h3>
            <div class="flex gap-2 mb-3">
              <button type="button" data-action="pb-type" data-id="simple" class="flex-1 py-2 rounded-lg text-xs font-bold ${state.pbType==='simple' ? 'bg-[#13294b] text-white' : 'bg-stone-100 text-slate-600'}">متعامدة (Simple)</button>
              <button type="button" data-action="pb-type" data-id="skew" class="flex-1 py-2 rounded-lg text-xs font-bold ${state.pbType==='skew' ? 'bg-[#13294b] text-white' : 'bg-stone-100 text-slate-600'}">مائلة 45° (Skew)</button>
              <button type="button" data-action="pb-type" data-id="frames" class="flex-1 py-2 rounded-lg text-xs font-bold ${state.pbType==='frames' ? 'bg-[#13294b] text-white' : 'bg-stone-100 text-slate-600'}">إطارية (Frames)</button>
            </div>
            <div class="bg-stone-50 border border-stone-200 rounded-xl p-3 mb-4 flex justify-center">
              <svg viewBox="0 0 220 150" class="w-56 h-36 svg-interactive">
                <rect x="20" y="15" width="180" height="120" fill="#FFF" stroke="#13294b" stroke-width="5"/>
                ${state.pbType === 'skew' ? `
                  <line x1="20" y1="75" x2="110" y2="15" stroke="#a8822f" stroke-width="2.5"/>
                  <line x1="20" y1="135" x2="200" y2="15" stroke="#a8822f" stroke-width="2.5"/>
                  <line x1="110" y1="135" x2="200" y2="75" stroke="#a8822f" stroke-width="2.5"/>
                  <line x1="110" y1="15" x2="200" y2="75" stroke="#a8822f" stroke-width="2.5"/>
                  <line x1="20" y1="15" x2="200" y2="135" stroke="#a8822f" stroke-width="2.5"/>
                  <line x1="20" y1="75" x2="110" y2="135" stroke="#a8822f" stroke-width="2.5"/>
                ` : `
                  <line x1="80" y1="15" x2="80" y2="135" stroke="${state.pbType==='frames'?'#2c6a96':'#a8822f'}" stroke-width="${state.pbType==='frames'?4:2.5}"/>
                  <line x1="140" y1="15" x2="140" y2="135" stroke="${state.pbType==='frames'?'#2c6a96':'#a8822f'}" stroke-width="${state.pbType==='frames'?4:2.5}"/>
                  <line x1="20" y1="55" x2="200" y2="55" stroke="${state.pbType==='frames'?'#2c6a96':'#a8822f'}" stroke-width="${state.pbType==='frames'?4:2.5}"/>
                  <line x1="20" y1="95" x2="200" y2="95" stroke="${state.pbType==='frames'?'#2c6a96':'#a8822f'}" stroke-width="${state.pbType==='frames'?4:2.5}"/>
                `}
                ${state.pbType === 'frames' ? `
                  <rect x="75" y="10" width="10" height="10" fill="#13294b"/>
                  <rect x="135" y="10" width="10" height="10" fill="#13294b"/>
                  <rect x="75" y="130" width="10" height="10" fill="#13294b"/>
                  <rect x="135" y="130" width="10" height="10" fill="#13294b"/>
                ` : ''}
                <rect x="15" y="10" width="10" height="10" fill="#13294b"/>
                <rect x="195" y="10" width="10" height="10" fill="#13294b"/>
                <rect x="15" y="130" width="10" height="10" fill="#13294b"/>
                <rect x="195" y="130" width="10" height="10" fill="#13294b"/>
              </svg>
            </div>
            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-600 leading-relaxed">
              <strong class="text-[#13294b]">دراسة حالة من المحاضرة:</strong> مبنى قسم العمارة بجامعة أسيوط (الدور الأرضي واستوديوهات التصميم ومدرج المحاضرات ومعرض المشاريع) باستخدام شبكة كمرات متقاطعة واسعة بدون أعمدة تعيق الرؤية.
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500">تمرين 5: صالة 10×15 م</span>
            <button type="button" data-action="try-preset" data-l="15" data-w="10" class="text-xs font-bold text-[#a8822f] hover:underline">جرّب في المختبر ←</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- LECTURE 7 ---
  function renderLec7() {
    const span = Number(state.frameSpan) || 18;
    const spacing = Number(state.frameSpacing) || 5;
    const girderMinCm = Math.ceil((span * 100) / 16);
    const girderMaxCm = Math.ceil((span * 100) / 14);
    const secBeamCm = Math.ceil((spacing * 100) / 10);

    const frameTypes = [
      { id: 'linear', ar: 'الإطارات الخطية (Linear Frames)', desc: 'ذات كمرات أفقية وأضلاع رأسية تتعرض لإجهادات انحناء؛ تزداد كفاءتها بربط الأساسات بكمرة أفقية (سملات) أو تحويل الضلع الأفقي لشكل مثلثي.' },
      { id: 'polygonal', ar: 'متعددة الأضلاع (Polygonal Frames)', desc: 'كلما انطبق شكل الهيكل على مضلع القوى (Force Polygon) تعرض كله لإجهادات ضغط وقلت إجهادات الانحناء.' },
      { id: 'curvilinear', ar: 'الإطارات المنحنية / العقود (Curvilinear)', desc: 'عقود خطية مفردة أو مزدوجة الانحناء؛ العقود الثابتة (Fixed) أقوى من المفصلية لمقاومتها لقوة الدفع الأفقية من الرياح والحرارة.' },
      { id: 'vierendeel', ar: 'كمرات فرنديل (Vierendeel Girders)', desc: 'إطارات متعددة الباكيات تتيح حذف الأعمدة في الدور الأرضي أو المتكرر لخلق فراغات مفتوحة في المباني متعددة الطوابق.' }
    ];
    const activeF = frameTypes.find(f => f.id === state.frameType) || frameTypes[0];

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 card-elevated rounded-2xl p-6">
          <h2 class="text-lg font-extrabold text-[#13294b] mb-1">أنواع الإطارات الخرسانية (Concrete Frames Typologies)</h2>
          <p class="text-xs text-slate-500 mb-4">بفعل نظرية الاستمرارية يصبح العمود والكمرة عنصراً واحداً لتغطية بحور من 15 إلى نحو 40 متراً بالخرسانة المسلحة العادية، وأكثر من ذلك بالشد اللاحق أو بمنشآت خاصة</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            ${frameTypes.map(f => `
              <button type="button" data-action="frame-type" data-id="${f.id}"
                class="p-2.5 rounded-xl text-xs font-bold border transition ${state.frameType===f.id ? 'bg-[#13294b] text-white border-[#13294b]' : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'}">${f.ar.split('(')[0].trim()}</button>
            `).join('')}
          </div>
          <div class="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4">
            <svg viewBox="0 0 360 165" class="w-full h-44 svg-interactive">
              <line x1="20" y1="145" x2="340" y2="145" stroke="#13294b" stroke-width="2"/>
              ${state.frameType === 'linear' ? `
                <path d="M 65 145 L 55 40 L 305 40 L 295 145" fill="none" stroke="#13294b" stroke-width="10" stroke-linejoin="miter"/>
                <line x1="65" y1="145" x2="295" y2="145" stroke="#a8822f" stroke-width="3" stroke-dasharray="6 3"/>
                <text x="180" y="25" text-anchor="middle" font-size="11" fill="#13294b" font-weight="bold">Monolithic Rigid Frame (L = 12–22 m)</text>
                <text x="180" y="136" text-anchor="middle" font-size="10" fill="#a8822f" font-weight="bold">Tie Beam (سملات)</text>
              ` : state.frameType === 'polygonal' ? `
                <path d="M 55 145 L 70 60 L 180 25 L 290 60 L 305 145" fill="none" stroke="#2c6a96" stroke-width="9" stroke-linejoin="round"/>
                <text x="180" y="132" text-anchor="middle" font-size="11" fill="#2c6a96" font-weight="bold">Polygonal Frame — Higher Compression Efficiency</text>
              ` : state.frameType === 'curvilinear' ? `
                <path d="M 50 145 Q 180 -10 310 145" fill="none" stroke="#a8822f" stroke-width="10"/>
                <rect x="38" y="138" width="24" height="12" fill="#13294b"/>
                <rect x="298" y="138" width="24" height="12" fill="#13294b"/>
                <text x="180" y="132" text-anchor="middle" font-size="11" fill="#a8822f" font-weight="bold">Fixed Arch / Curvilinear Frame</text>
              ` : `
                <rect x="45" y="25" width="270" height="70" fill="none" stroke="#13294b" stroke-width="7"/>
                ${[100,155,210,265].map(x => `<line x1="${x}" y1="25" x2="${x}" y2="95" stroke="#13294b" stroke-width="6"/>`).join('')}
                <rect x="45" y="95" width="16" height="50" fill="#a8822f"/>
                <rect x="299" y="95" width="16" height="50" fill="#a8822f"/>
                <text x="180" y="132" text-anchor="middle" font-size="11" fill="#a8822f" font-weight="bold">Vierendeel Girder — Column-Free Ground Floor</text>
              `}
            </svg>
          </div>
          <div class="p-4 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            <strong class="text-[#13294b]">${activeF.ar}:</strong> ${activeF.desc}
          </div>
          <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-600">
            <strong class="text-[#13294b]">أمثلة معمارية من المحاضرة:</strong> مبنى <strong>Vodafone</strong> (Baumschlager Eberle) ووحدة الابتكار والتعلم <strong>UIAC</strong> بجامعة Ibero-American في ليون (Landa + Martínez Architects).
          </div>
        </div>

        <!-- Simple Concrete Frame Calculator -->
        <div class="lg:col-span-5 card-elevated rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-extrabold text-[#13294b] mb-3">حاسبة الإطار الخرساني البسيط (Simple Frame)</h3>
            <div class="space-y-4 mb-5">
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>بحر الإطار (Span: 12–22 m)</span>
                  <span class="text-[#a8822f] ltr-num">${span} m</span>
                </div>
                <input id="frameSpanSlider" type="range" min="12" max="24" step="1" value="${span}" class="w-full" />
              </div>
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>المسافة بين الإطارات (Spacing: 4–6 m)</span>
                  <span class="text-[#2c6a96] ltr-num">${spacing} m</span>
                </div>
                <input id="frameSpacingSlider" type="range" min="3.5" max="6.5" step="0.5" value="${spacing}" class="w-full" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 text-center">
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">عمق الكمرة الرئيسية (L/14–16)</div>
                <div class="text-lg font-extrabold text-[#13294b] ltr-num">${girderMinCm} – ${girderMaxCm} cm</div>
              </div>
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">عرض الكمرة الرئيسية</div>
                <div class="text-lg font-extrabold text-[#13294b] ltr-num">30 – 40 cm</div>
              </div>
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">عمق الكمرات الثانوية (S/10)</div>
                <div class="text-lg font-extrabold text-[#2c6a96] ltr-num">${secBeamCm} cm</div>
              </div>
              <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div class="text-[11px] text-slate-500">البلاطة بين الإطارات</div>
                <div class="text-sm font-extrabold text-[#a8822f] mt-1">Simple أو Hollow Block</div>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500">تمرين المحاضرة: صالة 12×18 م</span>
            <button type="button" data-action="try-preset" data-l="18" data-w="12" class="text-xs font-bold text-[#a8822f] hover:underline">جرّب في المختبر ←</button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // VIEW 3: INTERACTIVE DESIGN LAB & COMPARISON
  // =========================================================================
  function evaluateSystems(L, W) {
    const big = Math.max(L, W);
    const small = Math.min(L, W);
    const area = big * small;
    const ratio = big / small;

    const results = [
      {
        nameAr: 'نظام الكمرات البسيطة (Simple Beam)',
        lec: 2,
        fit: big <= 6.5 ? 'مثالي' : (big <= 8 ? 'ممكن بكمرات ثانوية' : 'غير اقتصادي'),
        score: big <= 6.5 ? 3 : (big <= 8 ? 2 : 1),
        sizing: `نوع البلاطة: ${ratio >= 2 ? 'One-Way' : 'Two-Way'} (b/a=${ratio.toFixed(2)}) · سمك مقترح 12–16 سم`
      },
      {
        nameAr: 'البلاطات اللاكمرية (Flat Slab)',
        lec: 3,
        fit: ratio > 2 ? 'غير مناسب (النسبة تتجاوز 2:1)' : (small >= 4 && big <= 9 ? 'مثالي' : (big <= 12.2 ? 'ممكن بسمك أكبر أو بسقوط/تاج' : (big <= 14.3 ? 'مناسب بالشد اللاحق' : 'خارج المدى'))),
        score: ratio > 2 ? 1 : (small >= 4 && big <= 9 ? 3 : (big <= 14.3 ? 2 : 1)),
        sizing: `سمك البلاطة (L/36): ${Math.max(15, Math.ceil(big*100/36))} سم · عرض السقوط ≥ ${(big/3).toFixed(2)} م`
      },
      {
        nameAr: 'السقف الهوردي (Hollow Block)',
        lec: 4,
        fit: small >= 4.5 && small <= 9.5 && big <= 11 ? 'مثالي' : (small <= 10 ? 'ممكن' : 'غير مناسب'),
        score: small >= 4.5 && small <= 9.5 && big <= 11 ? 3 : (small <= 10 ? 2 : 1),
        sizing: `أعصاب b=100 مم، بلوك e=400 مم · سمك كلي t ≈ ${Math.max(25, Math.ceil(small*100/20/5)*5)} سم (نحو Span/20 للبحر الأصغر)${small*100/20 > 32 ? ' — يتجاوز 32 سم: يلزم كمرات ثانوية أو نظام آخر' : ''}`
      },
      {
        nameAr: 'البلاطات الشبكية (Waffle Slab)',
        lec: 5,
        fit: small >= 7 && big <= 16.8 ? 'مثالي' : (big > 16.8 && big <= 24.4 ? 'مثالي بالشد اللاحق' : 'مبالغ فيه للبحر الصغير'),
        score: small >= 7 && big <= 16.8 ? 3 : (big > 16.8 && big <= 24.4 ? 3 : 1),
        sizing: `عمق البلاطة (Span/24): ${Math.max(25, Math.ceil(big*100/24))} سم · قوالب 60×60 أو 90×90 سم`
      },
      {
        nameAr: 'الكمرات المتقاطعة (Paneled Beams)',
        lec: 6,
        fit: area >= 64 && area <= 160 && small <= 12.5 && ratio <= 1.34 ? 'مثالي' : (area > 160 ? 'يحتاج Paneled Frames بدراسة خاصة' : 'غير مناسب (النسبة تتجاوز 4/3 أو المساحة صغيرة)'),
        score: area >= 64 && area <= 160 && small <= 12.5 && ratio <= 1.34 ? 3 : (area > 160 ? 2 : 1),
        sizing: `كمرة رئيسية ${Math.ceil((small*1000/16)/50)*50} مم · داخلية ${Math.ceil((small*1000/24)/50)*50} مم`
      },
      {
        nameAr: 'الإطارات الخرسانية (Concrete Frames)',
        lec: 7,
        fit: small >= 11 && small <= 22 ? 'مثالي' : (small > 22 ? 'مناسب بالشد اللاحق أو بمنشآت خاصة' : 'مكلف للبحور الصغيرة'),
        score: small >= 11 && small <= 22 ? 3 : (small > 22 ? 2 : 1),
        sizing: `عمق الكمرة الرئيسية (L/14): ${Math.ceil(small*100/14)} سم · عرض 30–40 سم · تباعد 4–6 م`
      }
    ];
    return results.sort((a, b) => b.score - a.score);
  }

  function renderLab() {
    const L = Math.max(2, Number(state.labL) || 12);
    const W = Math.max(2, Number(state.labW) || 9);
    const ranked = evaluateSystems(L, W);

    return `
      <div class="space-y-6 fade-in">
        <!-- Input & Exercise Presets -->
        <div class="card-elevated rounded-2xl p-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h1 class="text-xl font-extrabold text-[#13294b]">مختبر اختيار النظام الإنشائي والتصميم الأولي</h1>
              <p class="text-xs sm:text-sm text-slate-500">أدخل أبعاد الفراغ أو اختر أحد التمارين الرسمية السبع من محاضرات د. سيد مرعي</p>
            </div>
            <div class="px-3.5 py-2 rounded-xl bg-stone-100 text-xs font-extrabold text-[#13294b] ltr-num">
              Area = ${(L * W).toFixed(1)} m² · Ratio = ${(Math.max(L,W)/Math.min(L,W)).toFixed(2)}
            </div>
          </div>

          <!-- Official Lecture Exercise Presets -->
          <div class="flex flex-wrap gap-2 mb-5">
            ${EXERCISE_PRESETS.map(p => `
              <button type="button" data-action="lab-preset" data-l="${p.l}" data-w="${p.w}"
                class="px-3 py-1.5 rounded-lg text-xs font-bold border transition ${Number(L)===p.l && Number(W)===p.w ? 'bg-[#a8822f] text-white border-[#a8822f]' : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'}">
                ${p.label}
              </button>
            `).join('')}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <div class="flex justify-between text-xs font-bold mb-1"><span>طول الصالة L (متر)</span><span class="text-[#a8822f] ltr-num">${L} m</span></div>
              <input id="labLSlider" type="range" min="3" max="24" step="0.5" value="${L}" class="w-full" />
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold mb-1"><span>عرض الصالة W (متر)</span><span class="text-[#2c6a96] ltr-num">${W} m</span></div>
              <input id="labWSlider" type="range" min="3" max="20" step="0.5" value="${W}" class="w-full" />
            </div>
          </div>

          <!-- Ranked Recommendations -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${ranked.map(r => {
              const badgeCls = r.score === 3 ? 'bg-emerald-100 text-emerald-800' : (r.score === 2 ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-slate-500');
              const borderCls = r.score === 3 ? 'border-emerald-300 bg-emerald-50/30' : 'border-stone-200 bg-white';
              return `
                <div class="rounded-xl border p-4 flex flex-col justify-between ${borderCls}">
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${badgeCls}">${r.fit}</span>
                      <button type="button" data-action="start-lec" data-lec="${r.lec}" class="text-[11px] font-bold text-[#13294b] hover:text-[#a8822f]">محاضرة 0${r.lec} ←</button>
                    </div>
                    <h3 class="font-extrabold text-sm text-[#13294b] mb-2">${r.nameAr}</h3>
                    <p class="text-xs text-slate-600 leading-relaxed">${r.sizing}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Span Comparison Chart -->
        <div class="card-elevated rounded-2xl p-6">
          <h2 class="text-lg font-extrabold text-[#13294b] mb-1">مقارنة مدى البحور للأنظمة الإنشائية الستة (Span Ranges in Meters)</h2>
          <p class="text-xs text-slate-500 mb-4">مقارنة بصرية بين الحد الأدنى والأقصى التقريبي للبحور التقليدية المذكورة في المحاضرات</p>
          <div class="relative h-72">
            <canvas id="spanCompareChart"></canvas>
          </div>
        </div>

        <!-- Comprehensive Comparison Matrix -->
        <div class="card-elevated rounded-2xl p-6">
          <h2 class="text-lg font-extrabold text-[#13294b] mb-4">جدول المقارنة الشاملة بين الأنظمة الإنشائية</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-xs sm:text-sm text-right border-collapse">
              <thead>
                <tr class="bg-[#13294b] text-white">
                  <th class="p-3 rounded-tr-xl">النظام الإنشائي</th>
                  <th class="p-3">مدى البحور (Span)</th>
                  <th class="p-3">معادلة العمق الأولي</th>
                  <th class="p-3">مسار الأحمال</th>
                  <th class="p-3 rounded-tl-xl">أبرز الاستخدامات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                <tr class="hover:bg-stone-50"><td class="p-3 font-bold">Simple Beam (Solid)</td><td class="p-3 ltr-num">3 – 6 m</td><td class="p-3">بلاطة 10–16 سم</td><td class="p-3">بلاطة ← كمرة ← عمود</td><td class="p-3">المباني السكنية والغرف التقليدية</td></tr>
                <tr class="hover:bg-stone-50"><td class="p-3 font-bold">Flat Slab</td><td class="p-3 ltr-num">3.05 – 12.2 m (PT: 14.3 m)</td><td class="p-3 ltr-num">Span/33 – Span/36</td><td class="p-3">بلاطة ← عمود مباشرة</td><td class="p-3">الإداري والسكني المرن وتقليل الارتفاع</td></tr>
                <tr class="hover:bg-stone-50"><td class="p-3 font-bold">Hollow Block (الهوردي)</td><td class="p-3 ltr-num">5 – 9 m</td><td class="p-3 ltr-num">t = h + ts (20–32 cm)</td><td class="p-3">أعصاب ← كمرات مخفية/ساقطة</td><td class="p-3">الصالات المتوسطة والعزل الحراري والصوتي</td></tr>
                <tr class="hover:bg-stone-50"><td class="p-3 font-bold">Waffle Slab</td><td class="p-3 ltr-num">7.6 – 16.8 m (PT: 24.4 m)</td><td class="p-3 ltr-num">Span / 24</td><td class="p-3">أعصاب متعامدة ← رأس مصمت ← عمود</td><td class="p-3">المسارح والجراجات والبحور الكبيرة</td></tr>
                <tr class="hover:bg-stone-50"><td class="p-3 font-bold">Paneled Beams</td><td class="p-3 ltr-num">حتى 12 m (80–150 m²)</td><td class="p-3 ltr-num">رئيسية Ls/16 · داخلية Ls/24</td><td class="p-3">بلاطة ← كمرات متقاطعة ← رئيسية</td><td class="p-3">القاعات الدراسية والمعارض والاستوديوهات</td></tr>
                <tr class="hover:bg-stone-50"><td class="p-3 font-bold">Concrete Frames</td><td class="p-3 ltr-num">12–22 m (خاص حتى 80 m)</td><td class="p-3 ltr-num">L / 14 – L / 16</td><td class="p-3">بلاطة ← إطار متصل ← قواعد وسملات</td><td class="p-3">المصانع والصالات الرياضية والكباري</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // VIEW 4: INTERACTIVE QUIZ
  // =========================================================================
  function renderQuiz() {
    const byLec = state.quizFilter === 0 ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter(q => q.lec === state.quizFilter);
    const filtered = state.quizCatFilter === 'الكل' ? byLec : byLec.filter(q => q.cat === state.quizCatFilter);
    const totalAnswered = Object.keys(state.quizAnswers).length;
    const totalCorrect = Object.entries(state.quizAnswers).filter(([qid, ans]) => {
      const q = QUIZ_QUESTIONS.find(x => x.id === Number(qid));
      return q && q.ans === ans;
    }).length;
    const scopeAnswered = filtered.filter(q => state.quizAnswers[q.id] !== undefined).length;
    const scopeCorrect = filtered.filter(q => state.quizAnswers[q.id] === q.ans).length;
    const cats = ['الكل', 'المميزات', 'العيوب', 'الاستخدامات', 'المواصفات'];

    return `
      <div class="space-y-6 fade-in">
        <div class="card-elevated rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-extrabold text-[#13294b]">بنك الاختبارات التفاعلي (70 سؤالاً — 10 لكل محاضرة)</h1>
            <p class="text-xs sm:text-sm text-slate-500">يشمل مميزات وعيوب واستخدامات المباني وأبرز المواصفات والأبعاد لكل نظام مع تصحيح وشرح فوري</p>
          </div>
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="px-4 py-2 rounded-xl bg-[#13294b] text-white text-xs sm:text-sm font-extrabold">
              النتيجة الكلية: ${totalCorrect} / ${totalAnswered} (من 70)
            </div>
            <div class="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-[#2c6a96] text-xs font-extrabold">
              المعروض: ${scopeCorrect} / ${scopeAnswered} (من ${filtered.length})
            </div>
            <button type="button" id="resetQuizBtn" class="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#13294b]">إعادة المحاولة</button>
          </div>
        </div>

        <!-- Filter by Lecture & Category -->
        <div class="card-elevated rounded-2xl p-4 space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-extrabold text-slate-500 ml-1">تصفية حسب المحاضرة:</span>
            <button type="button" data-action="quiz-filter" data-lec="0" class="px-3 py-1.5 rounded-lg text-xs font-bold ${state.quizFilter===0 ? 'bg-[#a8822f] text-white' : 'bg-stone-50 border border-stone-200 text-slate-600 hover:bg-stone-100'}">جميع المحاضرات (70)</button>
            ${LECTURES.map(l => {
              const lecQs = QUIZ_QUESTIONS.filter(x => x.lec === l.id);
              const lecDone = lecQs.filter(x => state.quizAnswers[x.id] !== undefined).length;
              return `
                <button type="button" data-action="quiz-filter" data-lec="${l.id}" class="px-3 py-1.5 rounded-lg text-xs font-bold ${state.quizFilter===l.id ? 'bg-[#a8822f] text-white' : 'bg-stone-50 border border-stone-200 text-slate-600 hover:bg-stone-100'}">
                  محاضرة ${l.num} (${lecDone}/10)
                </button>
              `;
            }).join('')}
          </div>
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
            <span class="text-xs font-extrabold text-slate-500 ml-1">تصفية حسب المحور:</span>
            ${cats.map(c => `
              <button type="button" data-action="quiz-cat" data-cat="${c}" class="px-3 py-1.5 rounded-lg text-xs font-bold ${state.quizCatFilter===c ? 'bg-[#13294b] text-white' : 'bg-stone-50 border border-stone-200 text-slate-600 hover:bg-stone-100'}">${c}</button>
            `).join('')}
          </div>
        </div>

        <!-- Questions List -->
        <div class="space-y-4">
          ${filtered.map((q, i) => {
            const picked = state.quizAnswers[q.id];
            const isAnswered = picked !== undefined;
            const isCorrect = isAnswered && picked === q.ans;
            const catColor = q.cat === 'المميزات' ? 'bg-emerald-50 text-emerald-700' : q.cat === 'العيوب' ? 'bg-red-50 text-red-700' : q.cat === 'الاستخدامات' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-[#13294b]';
            return `
              <div class="card-elevated rounded-2xl p-5">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-md bg-stone-100 text-[#13294b] text-xs font-bold">سؤال ${i + 1} · محاضرة 0${q.lec}</span>
                    <span class="px-2.5 py-0.5 rounded-md text-xs font-bold ${catColor}">${q.cat}</span>
                  </div>
                  ${isAnswered ? `<span class="text-xs font-extrabold ${isCorrect ? 'text-[#2c6a96]' : 'text-red-600'}">${isCorrect ? 'إجابة صحيحة ✓' : 'إجابة غير صحيحة ✗'}</span>` : ''}
                </div>
                <h3 class="text-sm sm:text-base font-extrabold text-[#13294b] mb-3">${q.q}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  ${q.opts.map((opt, idx) => {
                    let cls = 'bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100';
                    if (isAnswered) {
                      if (idx === q.ans) cls = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      else if (idx === picked) cls = 'bg-red-50 border-red-400 text-red-800';
                      else cls = 'bg-stone-50 border-stone-200 text-slate-400';
                    }
                    return `
                      <button type="button" data-action="quiz-ans" data-qid="${q.id}" data-opt="${idx}"
                        class="p-3 rounded-xl border text-right text-xs sm:text-sm transition ${cls}">
                        ${opt}
                      </button>
                    `;
                  }).join('')}
                </div>
                ${isAnswered ? `
                  <div class="mt-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 leading-relaxed">
                    <strong>التوضيح العلمي:</strong> ${q.exp}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // VIEW 4B: FULL ORIGINAL LECTURES MEDIA GALLERY (ALL 170 IMAGES)
  // =========================================================================
  function getFilteredGalleryItems() {
    const items = [];
    const lecIds = state.galleryLecFilter === 0 ? [1, 2, 3, 4, 5, 6, 7] : [state.galleryLecFilter];
    const seen = new Set();
    const q = state.gallerySearch.trim().toLowerCase();
    for (const lid of lecIds) {
      const lec = LECTURES.find(l => l.id === lid);
      const list = LECTURE_GALLERIES[lid] || [];
      for (const it of list) {
        if (state.galleryLecFilter === 0 && seen.has(it.id)) continue;
        seen.add(it.id);
        const cap = it.caption || '';
        if (q && !cap.toLowerCase().includes(q) && !('شريحة ' + it.slide).includes(q) && !lec.titleAr.toLowerCase().includes(q)) continue;
        items.push({ ...it, lecId: lid, lecNum: lec.num, lecTitle: lec.titleAr });
      }
    }
    return items;
  }

  function renderGallery() {
    const items = getFilteredGalleryItems();
    return `
      <div class="space-y-6 fade-in">
        <div class="card-elevated rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-extrabold text-[#13294b]">معرض صور ومخططات المحاضرات الأصلية (${TOTAL_ORIGINAL_IMAGES} صورة فريدة)</h1>
            <p class="text-xs sm:text-sm text-slate-500">جميع الصور الفوتوغرافية والرسومات التنفيذية والقطاعات المعمارية من ملفات المحاضرات السبع الأصلية</p>
          </div>
          <input id="gallerySearchInput" type="text" value="${state.gallerySearch}" placeholder="ابحث في الصور والمخططات..."
            class="px-3.5 py-2 rounded-xl border border-stone-300 text-sm w-full md:w-72 focus:outline-none focus:border-[#13294b]" />
        </div>

        <div class="flex flex-wrap gap-2">
          <button type="button" data-action="gal-filter" data-lec="0" class="px-3 py-1.5 rounded-lg text-xs font-bold ${state.galleryLecFilter===0 ? 'bg-[#a8822f] text-white' : 'bg-white border border-stone-200 text-slate-600 hover:bg-stone-100'}">جميع الصور الفريدة (${TOTAL_ORIGINAL_IMAGES})</button>
          ${LECTURES.map(l => `
            <button type="button" data-action="gal-filter" data-lec="${l.id}" class="px-3 py-1.5 rounded-lg text-xs font-bold ${state.galleryLecFilter===l.id ? 'bg-[#a8822f] text-white' : 'bg-white border border-stone-200 text-slate-600 hover:bg-stone-100'}">
              محاضرة ${l.num} (${(LECTURE_GALLERIES[l.id] || []).length})
            </button>
          `).join('')}
        </div>

        <div class="text-xs font-bold text-slate-500">يعرض حالياً: ${items.length} صورة — اضغط على أي صورة لفتحها بالحجم الكامل</div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          ${items.map((item, idx) => `
            <button type="button" data-action="open-lb-gal" data-idx="${idx}"
              class="group text-right card-elevated rounded-xl overflow-hidden hover:border-[#a8822f] transition flex flex-col">
              <div class="relative aspect-[4/3] w-full bg-white overflow-hidden">
                <img src="${LECTURE_IMG_STORE[item.id] || ''}" alt="${item.caption}" loading="lazy"
                  class="w-full h-full object-contain p-1.5 group-hover:scale-105 transition duration-300" />
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#13294b]/85 text-white text-[10px] font-bold">م${item.lecNum} · ش${item.slide}</span>
              </div>
              <div class="p-3 border-t border-stone-100 bg-white w-full">
                <div class="text-[11px] font-bold text-[#2c6a96] mb-0.5 truncate">${item.lecTitle}</div>
                <div class="text-xs font-semibold text-slate-700 leading-snug line-clamp-2">${item.caption}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // VIEW 5: REFERENCES
  // =========================================================================
  function renderReferences() {
    return `
      <div class="space-y-6 fade-in">
        <div class="card-elevated rounded-2xl p-6">
          <h1 class="text-xl font-extrabold text-[#13294b] mb-1">المراجع الأكاديمية المعتمدة للمقرر</h1>
          <p class="text-xs sm:text-sm text-slate-500">القائمة الكاملة للكتب والمراجع العلمية الواردة في محاضرات د. سيد مرعي منصور</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${REFERENCES.map((ref, idx) => `
            <div class="card-elevated rounded-2xl p-5 flex gap-4">
              <div class="w-10 h-10 rounded-xl bg-[#13294b] text-amber-300 font-extrabold text-sm flex items-center justify-center shrink-0">0${idx + 1}</div>
              <div>
                <div class="text-xs font-bold text-[#a8822f] ltr-num">${ref.author}</div>
                <h3 class="text-sm sm:text-base font-extrabold text-[#13294b] mt-0.5 ltr-num">${ref.title}</h3>
                <div class="text-xs text-slate-400 mb-2 ltr-num">${ref.pub}</div>
                <p class="text-xs text-slate-600 leading-relaxed">${ref.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHART RENDERING & EVENT BINDING
  // =========================================================================
  function initCharts() {
    destroyCharts();
    if (typeof Chart === 'undefined') return;

    const hbCanvas = document.getElementById('hbChart');
    if (hbCanvas) {
      activeCharts.push(new Chart(hbCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['أسمنتي 15', 'أسمنتي 20', 'أسمنتي 25', 'فلين 20'],
          datasets: [
            { label: 'One-Way (kN/m²)', data: [3.03, 3.30, 4.10, 0.70], backgroundColor: '#13294b', borderRadius: 6 },
            { label: 'Two-Way (kN/m²)', data: [3.36, 3.80, 4.78, 1.20], backgroundColor: '#a8822f', borderRadius: 6 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          scales: { y: { beginAtZero: true, title: { display: true, text: 'kN/m²' } } }
        }
      }));
    }

    const spanCanvas = document.getElementById('spanCompareChart');
    if (spanCanvas) {
      activeCharts.push(new Chart(spanCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Simple Beam', 'Hollow Block', 'Paneled Beams', 'Flat Slab', 'Waffle Slab', 'Simple Concrete Frame'],
          datasets: [
            { label: 'الحد الأدنى للبحر (م)', data: [3, 5, 6, 3.05, 7.62, 12], backgroundColor: '#9aa4b5', borderRadius: 6 },
            { label: 'الحد الأقصى التقليدي (م)', data: [6, 9, 12, 12.19, 16.76, 22], backgroundColor: '#2c6a96', borderRadius: 6 }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          scales: { x: { beginAtZero: true, title: { display: true, text: 'البحر (متر)' } } }
        }
      }));
    }
  }

  function bindDynamicEvents() {
    const root = document.getElementById('appRoot');
    if (!root) return;

    root.querySelectorAll('[data-action="start-lec"]').forEach(btn => {
      btn.addEventListener('click', () => navigateTo('lectures', Number(btn.dataset.lec)));
    });
    root.querySelectorAll('[data-nav-jump]').forEach(btn => {
      btn.addEventListener('click', () => navigateTo(btn.getAttribute('data-nav-jump')));
    });
    root.querySelectorAll('[data-action="select-lec"]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeLecture = Number(btn.dataset.lec);
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    const toggleComp = document.getElementById('toggleCompleteBtn');
    if (toggleComp) {
      toggleComp.addEventListener('click', () => {
        if (state.completedLectures.has(state.activeLecture)) {
          state.completedLectures.delete(state.activeLecture);
          showToast('تم إلغاء تحديد المحاضرة كمكتملة');
        } else {
          state.completedLectures.add(state.activeLecture);
          showToast('أحسنت! تم تسجيل المحاضرة كمكتملة');
        }
        saveProgress();
        renderApp();
      });
    }

    // Lec 1 bindings
    root.querySelectorAll('[data-action="select-load"]').forEach(btn => {
      btn.addEventListener('click', () => { state.selectedLoadId = btn.dataset.id; renderApp(); });
    });
    root.querySelectorAll('[data-dead-field]').forEach(inp => {
      inp.addEventListener('change', () => {
        const idx = Number(inp.dataset.idx);
        const field = inp.dataset.deadField;
        state.useSlideExact = false;
        state.deadLayers[idx][field] = Math.max(0, Number(inp.value) || 0);
        renderApp();
      });
    });
    const resetDead = document.getElementById('resetDeadLoadBtn');
    if (resetDead) {
      resetDead.addEventListener('click', () => {
        state.deadLayers = DEFAULT_DEAD_LAYERS.map(x => ({ ...x }));
        state.useSlideExact = true;
        renderApp();
        showToast('تمت استعادة قيم مثال المحاضرة الأولى');
      });
    }
    root.querySelectorAll('[data-action="live-cat"]').forEach(btn => {
      btn.addEventListener('click', () => { state.liveFilterCat = btn.dataset.cat; renderApp(); });
    });
    const liveSearch = document.getElementById('liveSearchInput');
    if (liveSearch) {
      liveSearch.addEventListener('input', (e) => {
        state.liveSearch = e.target.value;
        const pos = e.target.selectionStart;
        renderApp();
        const fresh = document.getElementById('liveSearchInput');
        if (fresh) { fresh.focus(); fresh.setSelectionRange(pos, pos); }
      });
    }

    // Lec 2 bindings
    root.querySelectorAll('[data-action="load-step"]').forEach(btn => {
      btn.addEventListener('click', () => { state.loadPathStep = Number(btn.dataset.step); renderApp(); });
    });
    const slabA = document.getElementById('slabAInput');
    const slabB = document.getElementById('slabBInput');
    if (slabA) slabA.addEventListener('change', () => { state.slabA = Number(slabA.value) || 4; renderApp(); });
    if (slabB) slabB.addEventListener('change', () => { state.slabB = Number(slabB.value) || 6; renderApp(); });
    root.querySelectorAll('[data-action="beam-type"]').forEach(btn => {
      btn.addEventListener('click', () => { state.beamType = btn.dataset.id; renderApp(); });
    });

    // Lec 3 bindings
    root.querySelectorAll('[data-action="flat-type"]').forEach(btn => {
      btn.addEventListener('click', () => { state.flatType = btn.dataset.id; renderApp(); });
    });
    const flatSlider = document.getElementById('flatSpanSlider');
    if (flatSlider) flatSlider.addEventListener('input', () => { state.flatSpan = Number(flatSlider.value); renderApp(); });

    // Lec 4 bindings
    root.querySelectorAll('[data-action="hb-block"]').forEach(btn => {
      btn.addEventListener('click', () => { state.hbBlockId = btn.dataset.id; renderApp(); });
    });

    // Lec 5 bindings
    const wSlider = document.getElementById('waffleSpanSlider');
    if (wSlider) wSlider.addEventListener('input', () => { state.waffleSpan = Number(wSlider.value); renderApp(); });
    root.querySelectorAll('[data-action="waffle-mod"]').forEach(btn => {
      btn.addEventListener('click', () => { state.waffleModule = Number(btn.dataset.mod); renderApp(); });
    });

    // Lec 6 bindings
    const pbL = document.getElementById('pbLInput');
    const pbLs = document.getElementById('pbLsInput');
    if (pbL) pbL.addEventListener('change', () => { state.pbL = Number(pbL.value) || 12; renderApp(); });
    if (pbLs) pbLs.addEventListener('change', () => { state.pbLs = Number(pbLs.value) || 10; renderApp(); });
    root.querySelectorAll('[data-action="pb-type"]').forEach(btn => {
      btn.addEventListener('click', () => { state.pbType = btn.dataset.id; renderApp(); });
    });

    // Lec 7 bindings
    root.querySelectorAll('[data-action="frame-type"]').forEach(btn => {
      btn.addEventListener('click', () => { state.frameType = btn.dataset.id; renderApp(); });
    });
    const fSpan = document.getElementById('frameSpanSlider');
    const fSpac = document.getElementById('frameSpacingSlider');
    if (fSpan) fSpan.addEventListener('input', () => { state.frameSpan = Number(fSpan.value); renderApp(); });
    if (fSpac) fSpac.addEventListener('input', () => { state.frameSpacing = Number(fSpac.value); renderApp(); });

    // Jump to Lab with Preset from Lectures
    root.querySelectorAll('[data-action="try-preset"]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.labL = Number(btn.dataset.l);
        state.labW = Number(btn.dataset.w);
        navigateTo('lab');
      });
    });

    // Lab bindings
    root.querySelectorAll('[data-action="lab-preset"]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.labL = Number(btn.dataset.l);
        state.labW = Number(btn.dataset.w);
        renderApp();
      });
    });
    const labL = document.getElementById('labLSlider');
    const labW = document.getElementById('labWSlider');
    if (labL) labL.addEventListener('input', () => { state.labL = Number(labL.value); renderApp(); });
    if (labW) labW.addEventListener('input', () => { state.labW = Number(labW.value); renderApp(); });

    // Lecture interactive tabs & quick quiz jump
    root.querySelectorAll('[data-action="lec-detail-tab"]').forEach(btn => {
      btn.addEventListener('click', () => { state.lecDetailTab = btn.dataset.tab; renderApp(); });
    });
    root.querySelectorAll('[data-action="lec-quiz-jump"]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.quizFilter = Number(btn.dataset.lec);
        state.quizCatFilter = 'الكل';
        navigateTo('quiz');
      });
    });

    // Quiz bindings
    root.querySelectorAll('[data-action="quiz-filter"]').forEach(btn => {
      btn.addEventListener('click', () => { state.quizFilter = Number(btn.dataset.lec); renderApp(); });
    });
    root.querySelectorAll('[data-action="quiz-cat"]').forEach(btn => {
      btn.addEventListener('click', () => { state.quizCatFilter = btn.dataset.cat; renderApp(); });
    });
    root.querySelectorAll('[data-action="quiz-ans"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = Number(btn.dataset.qid);
        if (state.quizAnswers[qid] !== undefined) return;
        state.quizAnswers[qid] = Number(btn.dataset.opt);
        renderApp();
      });
    });
    const resetQuiz = document.getElementById('resetQuizBtn');
    if (resetQuiz) {
      resetQuiz.addEventListener('click', () => {
        state.quizAnswers = {};
        renderApp();
        showToast('تم تصفير الاختبار — بالتوفيق!');
      });
    }

    // Gallery & Lightbox bindings
    root.querySelectorAll('[data-action="gal-filter"]').forEach(btn => {
      btn.addEventListener('click', () => { state.galleryLecFilter = Number(btn.dataset.lec); renderApp(); });
    });
    const galSearch = document.getElementById('gallerySearchInput');
    if (galSearch) {
      galSearch.addEventListener('input', (e) => {
        state.gallerySearch = e.target.value;
        const pos = e.target.selectionStart;
        renderApp();
        const fresh = document.getElementById('gallerySearchInput');
        if (fresh) { fresh.focus(); fresh.setSelectionRange(pos, pos); }
      });
    }
    root.querySelectorAll('[data-action="open-lb-lec"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lid = Number(btn.dataset.lec);
        const lec = LECTURES.find(l => l.id === lid);
        const list = (LECTURE_GALLERIES[lid] || []).map(it => ({ ...it, lecNum: lec.num, lecTitle: lec.titleAr }));
        openLightbox(list, Number(btn.dataset.idx));
      });
    });
    root.querySelectorAll('[data-action="open-lb-gal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        openLightbox(getFilteredGalleryItems(), Number(btn.dataset.idx));
      });
    });
  }

  function renderLightboxView() {
    const modal = document.getElementById('lightboxModal');
    const imgEl = document.getElementById('lbImg');
    const metaEl = document.getElementById('lbMeta');
    const capEl = document.getElementById('lbCaption');
    const cntEl = document.getElementById('lbCounter');
    if (!modal || !state.lightboxList.length) return;
    const item = state.lightboxList[state.lightboxIdx];
    imgEl.src = LECTURE_IMG_STORE[item.id] || '';
    imgEl.alt = item.caption || '';
    metaEl.textContent = `محاضرة ${item.lecNum} (${item.lecTitle}) · شريحة ${item.slide}`;
    capEl.textContent = item.caption || '';
    cntEl.textContent = `${state.lightboxIdx + 1} / ${state.lightboxList.length}`;
  }

  function openLightbox(list, idx) {
    if (!list || !list.length) return;
    state.lightboxList = list;
    state.lightboxIdx = Math.max(0, Math.min(idx || 0, list.length - 1));
    const modal = document.getElementById('lightboxModal');
    if (modal) modal.classList.remove('hidden');
    renderLightboxView();
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) modal.classList.add('hidden');
  }

  function renderApp() {
    updateHeader();
    const root = document.getElementById('appRoot');
    if (!root) return;

    if (state.activeView === 'home') root.innerHTML = renderHome();
    else if (state.activeView === 'lectures') root.innerHTML = renderLecturesShell();
    else if (state.activeView === 'lab') root.innerHTML = renderLab();
    else if (state.activeView === 'gallery') root.innerHTML = renderGallery();
    else if (state.activeView === 'quiz') root.innerHTML = renderQuiz();
    else root.innerHTML = renderReferences();

    bindDynamicEvents();
    initCharts();
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Static Header Bindings
  document.getElementById('brandHomeBtn').addEventListener('click', () => navigateTo('home'));
  document.querySelectorAll('.nav-btn, .nav-btn-mobile').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.getAttribute('data-nav')));
  });
  document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    const mob = document.getElementById('mobileNav');
    if (mob) mob.classList.toggle('hidden');
  });

  // Lightbox static listeners
  document.getElementById('lbCloseBtn').addEventListener('click', closeLightbox);
  document.getElementById('lightboxModal').addEventListener('click', (e) => {
    if (e.target.id === 'lightboxModal') closeLightbox();
  });
  document.getElementById('lbPrevBtn').addEventListener('click', () => {
    if (!state.lightboxList.length) return;
    state.lightboxIdx = (state.lightboxIdx - 1 + state.lightboxList.length) % state.lightboxList.length;
    renderLightboxView();
  });
  document.getElementById('lbNextBtn').addEventListener('click', () => {
    if (!state.lightboxList.length) return;
    state.lightboxIdx = (state.lightboxIdx + 1) % state.lightboxList.length;
    renderLightboxView();
  });
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (!modal || modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') {
      state.lightboxIdx = (state.lightboxIdx - 1 + state.lightboxList.length) % state.lightboxList.length;
      renderLightboxView();
    } else if (e.key === 'ArrowLeft') {
      state.lightboxIdx = (state.lightboxIdx + 1) % state.lightboxList.length;
      renderLightboxView();
    }
  });

  // Initial Render
  renderApp();
})();
