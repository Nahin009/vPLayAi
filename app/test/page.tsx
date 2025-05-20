import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DialogDemo() {
  return (
    <div className='flex flex-row gap-2'>
                    <Button className="px-6">New Highlights</Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="px-6">New Clip</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Generate Clip</DialogTitle>
                            <DialogDescription>
                                Enter your query. Ai will take you to that place
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                </div>
  )
}
