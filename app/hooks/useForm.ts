import { ChangeEvent, useEffect, useState } from "react";

// interface IData {
//   [key: string]: string
// }

// type Data<T> = (formData: T) => IData

export const useForm = <T>(initState: T) => {
  const [formData, setFormData] = useState(initState);

  const onChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [ev.target.name]: ev.target.value,
    }));
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

  useEffect(() => {
    if (JSON.stringify(initState) !== JSON.stringify(formData)) {
      setFormData(initState);
    }
  }, [initState]);

  return {
    ...formData,
    formData,
    onChange,
    setFormData,
    resetForm,
    changeData,
  };
};