import app from "./app";

// app port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err.message}`);
    process.exit(1);
});