import app from "./app";
const PORT = process.env.PORT! || 5000;

app.listen(PORT || 5000, () => {
  console.log(`listening in port ${PORT || 5000}`);
});
