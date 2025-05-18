import { Hono } from "hono";

const splice = (str, start, delCount, newSubStr) => {
  return str.slice(0, start) + newSubStr +
    str.slice(start + Math.abs(delCount));
};

const app = new Hono();

app.get("/", (c) => {
  return c.text("TODO: Show setup website");
});

app.get("/d/:indices/*", (c) => {
  const indices = c.req.param("indices").trim();
  let path = c.req.path;
  path = path.substring("/d/".length);
  path = path.substring(path.indexOf("/") + 1);
  let atIndices: string[] = [];
  if (indices != "-1" && indices != "") {
    for (const index of indices.split(",")) {
      const numIndex = parseInt(index.trim());
      if (!isNaN(numIndex)) atIndices.push(parseInt(index.trim()));
    }
    atIndices = atIndices.sort((n1, n2) => n1 - n2);
    atIndices.reverse();
  }
  const hostSeperatorIndex = path.indexOf("/");
  const host = path.substring(0, hostSeperatorIndex);
  path = path.substring(hostSeperatorIndex + 1);
  for (const atIndex of atIndices) {
    path = splice(path, atIndex, 0, "@");
  }
  const url = `https://${host}/${path}`;
  c.status(302);
  c.header("Location", url);
  return c.html(
    `You should be redirected! If not, click <a href="${url}">here</a>`,
  );
});

app.get("/:indices/*", (c) => {
  let host = Deno.env.get("DEFAULT_REDIRECTION_HOST") ?? "";
  const indices = c.req.param("indices").trim();
  let path = c.req.path;
  path = path.substring('/'.length);
  path = path.substring(path.indexOf("/") + 1);
  let atIndices: string[] = [];
  if (indices != "-1" && indices != "") {
    for (const index of indices.split(",")) {
      const numIndex = parseInt(index.trim());
      if (!isNaN(numIndex)) atIndices.push(parseInt(index.trim()));
    }
    atIndices = atIndices.sort((n1, n2) => n1 - n2);
    atIndices.reverse();
  }
  for (const atIndex of atIndices) {
    path = splice(path, atIndex, 0, "@");
  }
  const url = `https://${host}/${path}`;
  c.status(302);
  c.header("Location", url);
  return c.html(
    `You should be redirected! If not, click <a href="${url}">here</a>`,
  );
});

Deno.serve({ port: 1337 }, app.fetch);
