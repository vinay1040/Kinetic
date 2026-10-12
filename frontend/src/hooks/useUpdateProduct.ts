import { updateProduct, type ProductUpdateRequest } from "@/services/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
type UpdateProductVariables = {
id: string;
updateData: ProductUpdateRequest;
};
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({id,updateData} : UpdateProductVariables) => updateProduct(id,updateData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey : ["products"],
            });
        },
    });
}