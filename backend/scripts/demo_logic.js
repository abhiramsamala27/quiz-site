require('dotenv').config();
const mongoose = require('mongoose');

// Mock Result model (since we can't easily import the backend modules in a standalone script without pathing issues)
const resultSchema = new mongoose.Schema({
  name: String,
  email: String,
  score: Number,
  totalQuestions: Number,
  timeTaken: String
});
const Result = mongoose.model('DemoResult', resultSchema);

async function runDemo() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Demo...");
    
    // Clear Demo Collection
    await Result.deleteMany({});
    
    // Create 4 candidates with varied scores (Total 3 People)
    const mockData = [
        { name: "Candidate A", email: "a@example.com", score: 9, totalQuestions: 10, timeTaken: "5m" }, // Qualified
        { name: "Candidate B", email: "b@example.com", score: 4, totalQuestions: 10, timeTaken: "5m" }, // Not Qualified
        { name: "Candidate C", email: "c@example.com", score: 6, totalQuestions: 10, timeTaken: "5m" }, // Not Qualified
        { name: "Candidate B (Retake)", email: "b@example.com", score: 8, totalQuestions: 10, timeTaken: "4m" } // Now B is Qualified!
    ];
    
    await Result.insertMany(mockData);
    console.log("Inserted 4 mock records for 3 unique candidates:");
    console.log("- A scored 9/10 (Pass)");
    console.log("- B scored 4/10 and then 8/10 (Pass)");
    console.log("- C scored 6/10 (Fail)");
    
    // Run the exact aggregation logic from adminController
    const allStats = await Result.aggregate([
      {
        $facet: {
          metrics: [
            {
              $group: {
                _id: null,
                totalAttempts: { $sum: 1 },
                highestScore: { $max: "$score" }
              }
            }
          ],
          candidates: [
            { $group: { _id: "$email" } },
            { $count: "count" }
          ],
          qualified: [
            {
              $group: {
                _id: "$email",
                bestScore: { $max: "$score" },
                totalQ: { $first: "$totalQuestions" }
              }
            },
            {
              $match: {
                $expr: {
                    $and: [
                        { $gt: ["$totalQ", 0] }, // Safety check for demo
                        { $gte: [{ $divide: ["$bestScore", "$totalQ"] }, 0.7] }
                    ]
                }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    const stats = {
      totalAttempts: allStats[0].metrics[0]?.totalAttempts || 0,
      totalCandidates: allStats[0].candidates[0]?.count || 0,
      qualifiedLeads: allStats[0].qualified[0]?.count || 0,
      highestScore: allStats[0].metrics[0]?.highestScore || 0
    };

    console.log("\n--- AGGREGATION RESULTS ---");
    console.log(`- Total Attempts:     ${stats.totalAttempts} (Total records)`);
    console.log(`- Total Candidates:   ${stats.totalCandidates} (Unique emails: A, B, C)`);
    console.log(`- Qualified Leads:    ${stats.qualifiedLeads} (A: 9/10, B: 8/10)`);
    console.log(`- Highest Score:      ${stats.highestScore}`);
    
    await mongoose.connection.close();
}

runDemo().catch(console.error);
