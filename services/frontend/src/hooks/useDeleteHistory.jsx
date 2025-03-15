// import { useState } from 'react';

// const useDeleteHistory = (deleteAllHistory, setItems, setCount) => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDeleteHistory = async () => {
//     try {
//       setIsDeleting(true);
//       await deleteAllHistory();
//       setItems([]);
//       setCount(0);
//     } catch (error) {
//       console.error('Error trying to delete historial:', error);
//     } finally {
//       setIsDeleting(false);
//       setIsDialogOpen(false); // Cerrar el diálogo después de la operación
//     }
//   };

//   return {
//     isDialogOpen,
//     setIsDialogOpen,
//     handleDeleteHistory,
//     isDeleting,
//   };
// };

// export default useDeleteHistory;
import { useState } from 'react';

const useDeleteHistory = (deleteAllHistory, setItems, setCount) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteHistory = async () => {
    try {
      setIsDeleting(true);
      await deleteAllHistory(); // Llama a la función para eliminar el historial
      setItems([]); // Limpia los items
      setCount(0); // Reinicia el contador
    } catch (error) {
      console.error('Error al eliminar el historial:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleDeleteHistory,
    isDeleting,
  };
};

export default useDeleteHistory;