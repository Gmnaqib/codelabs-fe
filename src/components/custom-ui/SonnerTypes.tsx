// "use client"

// import { toast } from "sonner"
// import { Button } from "@/components/ui/button"

// interface SonnerTypesProps {
//   type: "success" | "error"
//   message?: string
// }

// export function SonnerTypes({ type, message }: SonnerTypesProps) {
//   const handleToast = () => {
//     if (type === "success") {
//       toast.success(message ?? "Event has been created")
//     } else if (type === "error") {
//       toast.error(message ?? "Event has not been created")
//     }
//   }

//   return (
//     <Button variant="outline" onClick={handleToast}>
//       {type === "success" ? "Success" : "Error"}
//     </Button>
//   )
// }
