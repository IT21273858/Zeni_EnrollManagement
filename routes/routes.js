var express = require('express');

const router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient();


// Enrollment creation
router.route('/enrollment/create/:id').post((req, res) => {
    const enrollmentData = {
        courseId: req.params.id,
        userId: req.body.userId,
        progress: "0",
        e_status: req.body.e_status,
        // payment:req.body.payment
    };

    prisma.enrollment.create({ data: enrollmentData })
        .then((enrollment) => {
            if (enrollment) {
                console.log("Enrollment created:", enrollment);
                res.status(201).json({ status: true, message: "Enrollment sucess", enrollment: enrollment })
                // const moduleData = {
                //     m_name: req.body.m_name,
                //     m_description: req.body.m_description,
                //     m_type: req.body.m_type,
                //     courseId: "663abb6d3ef1eeb3638be0f0",
                //     resources: { connect: { id: resource.id } } // Connecting the created resource to the module
                // };

                // prisma.module.create({ data: moduleData })
                //     .then((module) => {
                //         console.log("Module created:", module);
                //         const data = {
                //             moduleId: module.id
                //         }
                //         prisma.resources.update({
                //             where: {
                //                 id: resource.id
                //             }, data
                //         }).then((res) => {
                //             console.log("Resource updated with moduleID");
                //         }).catch((err) => {
                //             console.log("Error while updating moduleId in Resources", err);
                //         })
                //         const courseData = {
                //             c_name: req.body.c_name,
                //             c_description: req.body.c_description,
                //             c_thumbnail: req.body.c_thumbnail,
                //             classification: req.body.classification,
                //             visibility: false,
                //             c_InstructorId: req.body.c_InstructorId,
                //             module: { connect: { id: module.id } }
                //         };

                //         prisma.course.create({ data: courseData })
                //             .then((course) => {
                //                 console.log("Course created:", course);
                //                 const data = {
                //                     courseId: course.id
                //                 }
                //                 prisma.module.update({
                //                     where: {
                //                         id: module.id
                //                     }, data
                //                 }).then((re) => {
                //                     console.log("Module updated with courseId");
                //                 }).catch((er) => {
                //                     console.log("Error while updating courseId in Module", er);
                //                 })

                //                 res.status(201).json({ status: true, message: `Course, module, and resource created successfully`, data: course, code: "201" });
                //             })
                //             .catch((courseError) => {
                //                 console.error("Error creating course:", courseError);
                //                 res.status(500).json({ status: false, message: "New Course cannot be created", code: "500" });
                //             });
                //     })
                //     .catch((moduleError) => {
                //         console.error("Error creating module:", moduleError);
                //         res.status(500).json({ status: false, message: "New Module cannot be created", code: "500" });
                //     });
            } else {
                res.status(400).json({ status: false, message: "Error creating Enrollment", code: "400" });
            }
        })
        .catch((resourceError) => {
            console.error("Error creating enrollment:", resourceError);
            res.status(500).json({ status: false, message: "New Enrollment cannot be created", code: "500" });
        });
});

// Get All Enrollments
router.route('/enrollment/getAll').get((req, res) => {
    try {
        prisma.enrollment.findMany({
            include: {
                payment: true,
                user: true,
                course: true

            }
        }).then((data) => {
            res.status(200)
                .json({ status: true, message: "Enrollments retrieved successful", enrollment: data, code: "200" });
        })

    } catch (error) {
        console.error("Error finding enrollments:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", code: 500 });
    }
})


// Function for Retreive only the specific enrollment based on the id
router.route('/enrollment/get/:id').get((req, res) => {
    const _id = req.params.id
    try {
        prisma.enrollment.findUnique({
            where: {
                id: _id,
            },
            include: {
                payment: true,
                user: true,
                course: true
            }
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "Enrollment found", enrollment: data, code: "200" })
            } else {
                res.status(404).json({ status: false, message: "Enrollment not found", code: "404" });
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Error while fetching course", code: "500" });
        console.log("Error while fetching course", error);
    }
});

// Update Enrollment details

router.route('/enrollment/update/:id').patch((req, res) => {
    const _id = req.params.id
    const enrollmentData = {
        courseId: req.body.courseId,
        userId: req.body.userId,
        progress: "0",
        e_status: req.body.e_status,
        // payment:req.body.payment
    };

    try {
        prisma.enrollment.update({
            where: {
                id: _id
            },
            data: enrollmentData
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "Enrollment Updated Sucessfully", data: data, code: "200" })
            }
            else {
                res.status(404).json({ status: false, message: "Enrollment not found", code: "404" })
            }
        })
    } catch (error) {
        res.status(500).json({ status: false, message: "Error occured while updating Enrollment", code: "500" })
    }
});


// Delete Enrollment
router.route('/enrollment/delete/:id').delete((req, res) => {
    const _id = req.params.id
    try {
        prisma.enrollment.findUnique({
            where: {
                id: _id,
            }
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "Enrollment deleted", code: "200" })
            } else {
                res.status(404).json({ status: false, message: "Enrollment could not found", code: "404" });
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Error while deleting enrollment", code: "500" });
    }

});

module.exports = router;