import express from "express";
import con from "../config.js"; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: API for managing the job offers
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Retrieve all job offers
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of job offers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Response message
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       job_id:
 *                         type: integer
 *                         description: ID of the job
 *                       company_name:
 *                         type: string
 *                         description: Name of the company
 *                       description:
 *                         type: string
 *                         description: Job description
 *       500:
 *         description: Server error
 */


router.get("/", (req, res) => {
  const sql = "SELECT job_id, company_name, description FROM jobs";
  con.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving jobs:", err);
      return res.status(500).json({ message: "Failed to retrieve jobs." });
    }
    res.status(200).json({
      message: "Jobs retrieved successfully.",
      data: results,
    });
  });
});

/**
 * @swagger
 * /api/jobs/{job_id}:
 *   get:
 *     summary: Retrieve a specific job offer by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job to retrieve
 *     responses:
 *       200:
 *         description: Job details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Response message
 *                 data:
 *                   type: object
 *                   properties:
 *                     job_id:
 *                       type: integer
 *                       description: ID of the job
 *                     company_name:
 *                       type: string
 *                       description: Name of the company
 *                     description:
 *                       type: string
 *                       description: Job description
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */


router.get("/:job_id", (req, res) => {
  const { job_id } = req.params; 
  const sql = "SELECT job_id, company_name, description FROM jobs WHERE job_id = ?";

  con.query(sql, [job_id], (err, results) => {
    if (err) {
      console.error("Error retrieving job:", err);
      return res.status(500).json({ message: "Failed to retrieve job." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.status(200).json({
      message: "Job retrieved successfully.",
      data: results[0], 
    });
  });
});

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job offer
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_name
 *               - description
 *             properties:
 *               company_name:
 *                 type: string
 *                 description: Name of the company
 *               description:
 *                 type: string
 *                 description: Job description
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Response message
 *                 data:
 *                   type: object
 *                   properties:
 *                     job_id:
 *                       type: integer
 *                       description: ID of the created job
 *                     company_name:
 *                       type: string
 *                       description: Name of the company
 *                     description:
 *                       type: string
 *                       description: Job description
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */


router.post("/", (req, res) => {
  const { company_name, description } = req.body;

  if (!company_name || !description) {
    return res.status(400).json({ message: "Company name and description are required." });
  }

  const sql = "INSERT INTO jobs (company_name, description) VALUES (?, ?)";
  con.query(sql, [company_name, description], (err, results) => {
    if (err) {
      console.error("Error creating job:", err);
      return res.status(500).json({ message: "Failed to create job." });
    }

    const jobId = results.insertId; 
    res.status(201).json({
      message: "Job created successfully.",
      data: {
        job_id: jobId,
        company_name,
        description,
      },
    });
  });
});

/**
 * @swagger
 * /api/jobs/{job_id}:
 *   delete:
 *     summary: Delete a specific job offer by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job to delete
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */


router.delete("/:job_id", (req, res) => {
  const { job_id } = req.params;
  const sql = "DELETE FROM jobs WHERE job_id = ?";

  con.query(sql, [job_id], (err, results) => {
    if (err) {
      console.error("Error deleting job:", err);
      return res.status(500).json({ message: "Failed to delete job." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.status(200).json({ message: "Job deleted successfully." });
  });
});

export default router;
