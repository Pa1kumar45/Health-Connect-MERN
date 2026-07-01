import Doctor from "../models/Doctor.js";
import model from "../lib/gemini.js";

export const recommendDoctors = async (req, res) => {
    try {

        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({
                success: false,
                message: "Symptoms are required"
            });
        }

        // Get all available doctors
        const availableDoctors = await Doctor.find().select("specialization");
        // Remove duplicate specializations
        const specializations = [
            ...new Set(availableDoctors.map(doc => doc.specialization))
        ];

        const prompt = `
You are an AI assistant helping patients choose the correct doctor.

Patient symptoms:
${symptoms}

Available medical specializations:
${specializations.join(", ")}

Rules:

- ONLY use specializations from the available list.
- Never invent new specializations.
- Return EXACTLY 3 recommendations.
- Order from most suitable to least suitable.
- If an ideal specialization is unavailable, choose the closest available one.

Return ONLY JSON.

Example:

{
  "recommendations":[
    "Cardiology",
    "General Medicine",
    "Neurology"
  ]
}
`;

        const result = await model.generateContent(prompt);

        let response = result.response.text();
        
        response = response
            .replace(/```json/g , "")
            .replace(/```/g, "")
            .trim();
        
        const aiResult = JSON.parse(response);

       res.json({
            success: true,
            recommendations: aiResult.recommendations
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to generate recommendation"
        });
    }
};