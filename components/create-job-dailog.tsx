"use client"

import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import createJobApplication from "@/lib/actions/job-applications"

interface CreateJobApplicationDailogProps {
    columnId: string,
    boardId: string
}

export default function CreateJobApplicationDailog({ columnId, boardId }: CreateJobApplicationDailogProps) {

    const initialFormData = {
        company: "",
        position: "",
        location: "",
        notes: "",
        salary: "",
        jobUrl: "",
        tags: "",
        description: ""
    }

    const [open, setOpen] = useState<boolean>(false)
    const [formdata, setFormdata] = useState(initialFormData)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await createJobApplication({
                ...formdata,
                columnId,
                boardId,
                tags: formdata.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
            })

            if(!res.error) {
                setFormdata(initialFormData);
            }else {
                console.error("Failed to create job: ", res.error)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline">
                    <Plus />
                    Add Job
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Job Application</DialogTitle>
                    <DialogDescription>Track a new job application</DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input
                                    id="company"
                                    required
                                    value={formdata.company}
                                    onChange={(e) => setFormdata({ ...formdata, company: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position *</Label>
                                <Input
                                    id="position"
                                    required
                                    value={formdata.position}
                                    onChange={(e) => setFormdata({ ...formdata, position: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={formdata.location}
                                    onChange={(e) => setFormdata({ ...formdata, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input
                                    id="salary"
                                    required
                                    placeholder="e.g. $100k-$150k"
                                    value={formdata.salary}
                                    onChange={(e) => setFormdata({ ...formdata, salary: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="joburl">Job URL</Label>
                            <Input
                                id="joburl"
                                required
                                placeholder="https://"
                                value={formdata.jobUrl}
                                onChange={(e) => setFormdata({ ...formdata, jobUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma seperated)</Label>
                            <Input
                                id="tags"
                                required
                                placeholder="React, Tailwind, High Pay"
                                value={formdata.tags}
                                onChange={(e) => setFormdata({ ...formdata, tags: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                required
                                rows={3}
                                placeholder="Brief description of the role..."
                                value={formdata.description}
                                onChange={(e) => setFormdata({ ...formdata, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                rows={4}
                                value={formdata.notes}
                                onChange={(e) => setFormdata({...formdata, notes: e.target.value})}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Application</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}