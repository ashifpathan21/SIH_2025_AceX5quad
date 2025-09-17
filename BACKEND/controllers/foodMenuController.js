import FoodMenu from "../models/foodMenuModel.js";
import Student from "../models/studentModel.js";
import { sendSMS } from "../utils/sms.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ✅ helper: translate items to Hindi
const translateToHindi = async (items) => {
  try {
    const inputText = Array.isArray(items) ? items.join(", ") : items;
    const prompt = `Translate the following food items into Hindi only (comma separated, no explanation): ${inputText}`;
    const result = await model.generateContent(prompt);
    const translated = result.response.text().trim();
    return translated.split(",").map((item) => item.trim());
  } catch (err) {
    console.error("❌ Translation failed:", err);
    return items; // fallback if Gemini fails
  }
};

// ✅ Create Food Menu
export const createFoodMenu = async (req, res) => {
  try {
    let { items } = req.body;
    const today = new Date();

    if (!Array.isArray(items)) {
      items = [items];
    }

    // Translate items
    const hindiItems = await translateToHindi(items);

    // Save menu with school reference
    const menu = await FoodMenu.create({
      date: today,
      items: hindiItems,
      school: req.user.school, // 🏫 link menu to the user's school
    });

    // Fetch only students of this school
    const students = await Student.find({ school: req.user.school });

    // Prepare SMS
    const hindiMessage = `प्रिय अभिभावक,\n\nआज के स्कूल के भोजन में: ${hindiItems.join(
      ", "
    )} शामिल है।\n\nकृपया बच्चों को स्कूल भेजें ताकि वे पढ़ाई के साथ स्वस्थ भोजन भी कर सकें।\n\n🌟 टॉप स्टूडेंट्स: ${students
      .slice(0, 5)
      .map((s) => s.name)
      .join(", ")}\n\nधन्यवाद 🙏`;

    // Send SMS only to this school’s students
    for (let student of students) {
      if (student.parentsContact?.contact) {
        try {
          await sendSMS(student.parentsContact.contact, hindiMessage);
        } catch (smsErr) {
          console.error(
            `❌ SMS failed for ${student.name} (${student.parentsContact.contact}):`,
            smsErr
          );
        }
      }
    }

    res.json({ message: "Menu created & SMS sent ✅", menu });
  } catch (err) {
    console.error("❌ Error creating menu:", err);
    res
      .status(500)
      .json({ message: "Error creating menu", error: err.message });
  }
};

// ✅ Get Food Menu (for logged in user's school only)
export const getFoodMenu = async (req, res) => {
  try {
    const menus = await FoodMenu.find({ school: req.user.school }).sort({
      date: -1,
    });
    res.json(menus);
  } catch (err) {
    console.error("❌ Error fetching menu:", err);
    res
      .status(500)
      .json({ message: "Error fetching menu", error: err.message });
  }
};

// ✅ Delete Food Menu
export const deleteFoodMenu = async (req, res) => {
  try {
    const menu = await FoodMenu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // 🛑 Ensure menu belongs to same school
    if (menu.school.toString() !== req.user.school.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this menu" });
    }

    await FoodMenu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu deleted ✅" });
  } catch (err) {
    console.error("❌ Error deleting menu:", err);
    res
      .status(500)
      .json({ message: "Error deleting menu", error: err.message });
  }
};
