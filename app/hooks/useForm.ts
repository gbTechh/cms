import { ChangeEvent, useState } from "react";

type OnChangeInput =
  | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  | { name: string; value: any };

export const useForm = <T extends Record<string, any>>(initState: T) => {
  const [formData, setFormData] = useState(initState);

  const onChange = (input: OnChangeInput) => {
    // Manejar ChangeEvent
    if ("target" in input) {
      setFormData((prev) => ({
        ...prev,
        [input.target.name]: input.target.value,
      }));
    }
    // Manejar objeto { name, value }
    else {
      const { name, value } = input;
      console.log({ input });
      if (name) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const changeData = (row: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [row]: value,
    }));
  };

  const resetForm = () => {
    setFormData({ ...initState });
  };

  return {
    ...formData,
    formData,
    onChange,
    setFormData,
    resetForm,
    changeData,
  };
};
