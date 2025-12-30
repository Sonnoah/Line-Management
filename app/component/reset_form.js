const initialForm = {
  name: "",
  type: "",
  start_date: "",
  end_date: "",
  total_day: "",
  note: "",
};

const [formData, setFormData] = useState(initialForm);

const handleSubmit = async () => {
  const success = await saveToFirestore(formData);
  if (success) {
    setFormData(initialForm);
  }
};
