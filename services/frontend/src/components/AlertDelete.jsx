import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import alert dialog components
import { Button } from "@/components/ui/button"; // Import button component
import useDeleteHistory from "@/hooks/useDeleteHistory"; // Custom hook to handle history deletion

/**
 * AlertDelete Component
 * Displays a confirmation dialog before deleting history.
 *
 * @param {Function} deleteAllHistory - Function to delete all history.
 * @param {Function} setItems - Function to update the list of items after deletion.
 * @param {Function} setCount - Function to update the item count after deletion.
 */
export function AlertDelete({ deleteAllHistory, setItems, setCount }) {
  // Custom hook to manage delete history functionality
  const { handleDeleteHistory, isDeleting } = useDeleteHistory(
    deleteAllHistory,
    setItems,
    setCount
  );

  return (
    <AlertDialog>
      {/* Button to trigger the alert dialog */}
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-orange-600 text-white rounded px-4 py-2 cursor-pointer z-10"
        >
          Delete History
        </Button>
      </AlertDialogTrigger>

      {/* Alert dialog content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            history from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* Cancel button to close the dialog */}
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          {/* Action button to proceed with deletion */}
          <AlertDialogAction
            onClick={handleDeleteHistory} // Executes the delete function
            disabled={isDeleting} // Disables button while deletion is in progress
          >
            {isDeleting ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
