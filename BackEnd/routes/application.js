import express from "express";
import con from "../config.js"; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: API for managing applications
 */

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Retrieve all job applications
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: List of job applications
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
 *                       application_id:
 *                         type: integer
 *                         description: ID of the application
 *                       first_name:
 *                         type: string
 *                         description: First name of the applicant
 *                       last_name:
 *                         type: string
 *                         description: Last name of the applicant
 *                       email:
 *                         type: string
 *                         description: Email of the applicant
 *                       phone:
 *                         type: string
 *                         description: Phone number of the applicant
 */
router.get("/applications", (req, res) => {
  const sql = "SELECT application_id, first_name, last_name, email, phone FROM applications";
  con.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving applications:", err);
      return res.status(500).json({ message: "Failed to retrieve applications" });
    }
    res.status(200).json({
      message: "Applications retrieved successfully",
      data: results,
    });
  });
});

/**
 * @swagger
 * /api/applications/{application_id}:
 *   get:
 *     summary: Retrieve a specific job application by its ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: application_id
 *         required: true
 *         description: ID of the application to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details of the specific application
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
 *                     application_id:
 *                       type: integer
 *                       description: ID of the application
 *                     first_name:
 *                       type: string
 *                       description: First name of the applicant
 *                     last_name:
 *                       type: string
 *                       description: Last name of the applicant
 *                     email:
 *                       type: string
 *                       description: Email of the applicant
 *                     phone:
 *                       type: string
 *                       description: Phone number of the applicant
 *       404:
 *         description: Application not found
 */
router.get("/applications/:application_id", (req, res) => {
  const { application_id } = req.params;
  const sql = "SELECT application_id, first_name, last_name, email, phone FROM applications WHERE application_id = ?";

  con.query(sql, [application_id], (err, results) => {
    if (err) {
      console.error("Error retrieving application:", err);
      return res.status(500).json({ message: "Failed to retrieve application" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application retrieved successfully",
      data: results[0],
    });
  });
});

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Create a new job application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: First name of the applicant
 *               last_name:
 *                 type: string
 *                 description: Last name of the applicant
 *               email:
 *                 type: string
 *                 description: Email of the applicant
 *               phone:
 *                 type: string
 *                 description: Phone number of the applicant
 *               job_id:
 *                 type: integer
 *                 description: ID of the job being applied for
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 application_id:
 *                   type: integer
 *                   description: ID of the created application
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/applications", (req, res) => {
  const { first_name, last_name, email, phone, job_id } = req.body;

  if (!first_name || !last_name || !email || !phone || !job_id) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = "INSERT INTO applications (first_name, last_name, email, phone, job_id) VALUES (?, ?, ?, ?, ?)";
  const values = [first_name, last_name, email, phone, job_id];

  con.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error creating application:", err);
      return res.status(500).json({ message: "Failed to create application." });
    }

    res.status(201).json({
      message: "Application created successfully.",
      application_id: results.insertId,
    });
  });
});

/**
 * @swagger
 * /api/applications/{application_id}:
 *   delete:
 *     summary: Delete a specific job application by its ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: application_id
 *         required: true
 *         description: ID of the application to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.delete("/applications/:application_id", (req, res) => {
  const { application_id } = req.params;
  const sql = "DELETE FROM applications WHERE application_id = ?";

  con.query(sql, [application_id], (err, results) => {
    if (err) {
      console.error("Error deleting application:", err);
      return res.status(500).json({ message: "Failed to delete application" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  });
});

export default router;




