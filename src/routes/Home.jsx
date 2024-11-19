// pages/Home.jsx
import { useEffect, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { useForm } from "react-hook-form";

const Home = () => {
  const [copy, setCopy] = useState({});
  const [newOriginID, setNewOriginID] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    setValue,
  } = useForm();

  const { loading, data, error, getData, addData, deleteData, updateData } = useFirestore();

  useEffect(() => {
    getData();
  }, []);

  const onSubmit = async ({ url }) => {
    if (newOriginID) {
      await updateData(newOriginID, url);
      setNewOriginID("");
    } else {
      await addData(url);
    }
    resetField("url");
  };

  const handleClickDelete = async (id) => {
    await deleteData(id);
  };

  const handleClickEdit = (item) => {
    setValue("url", item.origin);
    setNewOriginID(item.nanoid);
  };

  const handleClickCopy = async (id) => {
    await navigator.clipboard.writeText(window.location.href + id);
    setCopy({ [id]: true });
  };

  if (loading.getData) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>CRUD App</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("url", { required: "URL is required" })}
          placeholder="Enter URL"
        />
        {errors.url && <p>{errors.url.message}</p>}
        <button type="submit">{newOriginID ? "Update URL" : "Add URL"}</button>
      </form>

      {data.map((item) => (
        <div key={item.nanoid}>
          <p>{item.origin}</p>
          <button onClick={() => handleClickEdit(item)}>Edit</button>
          <button onClick={() => handleClickDelete(item.nanoid)}>Delete</button>
          <button onClick={() => handleClickCopy(item.nanoid)}>
            {copy[item.nanoid] ? "Copied" : "Copy"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;
