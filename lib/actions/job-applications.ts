"use server"
import { error } from "console"
import { getSession } from "../auth/auth"
import connectDb from "../db"
import { Board, Column, JobApplications } from "../models"

interface jobApplicationData {
    company: string,
    position: string,
    location?: string,
    notes?: string,
    salary?: string,
    jobUrl?: string,
    tags?: string[],
    description?: string,
    boardId: string,
    columnId: string
}

export default async function createJobApplication(data: jobApplicationData) {
    const session = await getSession()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    await connectDb()

    const {
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        tags,
        description,
        boardId,
        columnId
    } = data

    // Only company, position, boardId, and columnId are required
    if (!company || !position || !boardId || !columnId) {
        return { error: "Missing required fields" }
    }

    //verify board ownership
    const board = await Board.findOne({
        _id: boardId,
        userId: session.user.id
    })

    if (!board) {
        return { error: "Board not found" }
    }

    //verify column belongs to board
    const column = await Column.findOne({
        _id: columnId,
        boardId: boardId
    });

    if (!column) {
        return { error: "Column not found" }
    }

    const maxOrder = (await JobApplications.findOne({ columnId }).sort({ order: -1 }).select("order").lean()) as { order: number } | null

    const jobApplication = await JobApplications.create({
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        tags: tags || [],
        description,
        status: "Applied",
        userId: session.user.id,
        order: maxOrder ? maxOrder.order + 1 : 0
    })

    await Column.findByIdAndUpdate(columnId, {
        $push: {JobApplications: jobApplication._id}
    })

    return { data: JSON.parse(JSON.stringify(jobApplication)) }
}