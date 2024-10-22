import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);

const characters = [];

const items = {
  bed: {
    name: "bed",
    size: [4, 5],
  },
  bookshelf: {
    name: "bookshelf",
    size: [3, 2],
  },
  chair: {
    name: "chair",
    size: [1, 1],
  },
  kitchenBar: {
    name: "kitchenBar",
    size: [2, 1],
  },
  fridge: {
    name: "fridge",
    size: [3, 2],
  },
  stove: {
    name: "stove",
    size: [2, 2],
  },
  sofa: {
    name: "sofa",
    size: [4, 2],
  },
  plant: {
    name: "plant",
    size: [1, 1],
  },
  table: {
    name: "table",
    size: [4, 2],
  },
};

const map = {
  size: [10, 10],
  gridDivision: 2,
  items: [
    {
      ...items.bed,
      gridPosition: [4, 4],
    },
    {
      ...items.bookshelf,
      gridPosition: [4, 0],
    },
    {
      ...items.chair,
      gridPosition: [6, 13],
      rotation: 1,
    },
    {
      ...items.kitchenBar,
      gridPosition: [0, 12],
      rotation: 1,
    },
    {
      ...items.fridge,
      gridPosition: [0, 16],
      rotation: 1,
    },
    {
      ...items.stove,
      gridPosition: [0, 14],
      rotation: 1,
    },
    {
      ...items.sofa,
      gridPosition: [8, 16],
      rotation: 2,
    },
    {
      ...items.plant,
      gridPosition: [6, 18],
      rotation: 2,
    },
    {
      ...items.table,
      gridPosition: [8, 12],
      rotation: 2,
    },
  ],
};

const generateRandomPosition = () => [
  Math.random() * map.size[0],
  0,
  Math.random() * map.size[1],
];

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("User connected");
  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });

  socket.emit("hello", {
    map,
    characters,
    id: socket.id,
    items,
  });

  io.emit("characters", characters);

  socket.on("move", (position) => {
    const character = characters.find(
      (character) => character.id === socket.id,
    );
    character.position = position;
    io.emit("characters", characters);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1,
    );
    io.emit("characters", characters);
  });
});
