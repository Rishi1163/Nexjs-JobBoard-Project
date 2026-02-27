import connectDb from "./db";
import {Board, Column} from "./models"
import jobApplications from "./models/jobApplications";

const DEFAULT_COLUMNS = [
    {
        name: "wish List",
        order: 0,
    },
    {
        name: "Applied",
        order: 1,
    },
    {
        name: "Interviewing",
        order: 2,
    },
    {
        name: "Offer",
        order: 3,
    },
    {
        name: "Rejected",
        order: 4,
    }
]

export async function initializeUserBoard(userId: string) {
    try{
        await connectDb()

        //check if board already exists
        const existingBoard = await Board.findOne({userId, name:"Job Hunt"})

        if(existingBoard) {
            return existingBoard
        }

        //create the board
        const board = await Board.create({
            name: "Job Hunt",
            userId,
            columns: []
        })

        const columns = await Promise.all(
            DEFAULT_COLUMNS.map((col) => Column.create({
                name: col.name,
                order: col.order,
                boardId: board._id,
                jobApplications: []
            }))
        )

        //update board with new column ids
        board.columns = columns.map((col) => col._id)
        await board.save()

        return board
    }catch(error) {

    }
}