// deno-lint-ignore-file

// <host (and port)>/<indices>/<redirection path>
// <host (and port)>/d/<indices>/<redirection domain and path>

var defaultRedirectionHost = null;
(async () => {
  const response = await fetch("getDefaultRedirectionHost");
  if (response.ok) {
    defaultRedirectionHost = await response.text();
    if (!isValidUrl(defaultRedirectionHost)) {
      defaultRedirectionHost = `https://${defaultRedirectionHost}`;
    }
  }
})();

function linkChanged() {
  const original = document.getElementById("original").value;
  if (!original.includes("@")) {
    // Don't do anything because the link does not include an @ so this tool shouldn't be used...
  }
  if (!isValidUrl(original)) return;
  const generated = document.getElementById("generated");
  while (generated.firstChild) {
    generated.removeChild(generated.lastChild);
  }
  const links = generateLinks(original);
  for (const link of links) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", link);
    a.innerText = link;
    li.appendChild(a);
    generated.appendChild(li);
  }
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateLinks(original) {
  const url = new URL(original);
  const drh = new URL(defaultRedirectionHost);
  const result = [];
  if (url.hostname == drh.hostname && url.port == drh.port) {
    result.push(
      combineUrlPath(window.location.href, getIndices(original).join(",")) +
        `${url.pathname.replace("@", "")}${
          url.search == "" ? "" : `?${url.search.replace("@", "")}`
        }`,
    );
  }
  if (
    (url.protocol.startsWith("http") &&
      (url.port == "80" || url.port == "80")) ||
    (url.protocol.startsWith("https") && (url.port == "443" || url.port == ""))
  ) {
    result.push(
      combineUrlPath(window.location.href, "d") +
        `/${getIndices(original).join(",")}/${url.hostname}${
          url.pathname.replace("@", "")
        }${url.search == "" ? "" : `?${url.search.replace("@", "")}`}`,
    );
  } else {
    result.push(
      combineUrlPath(window.location.href, "d") +
        `/${getIndices(original).join(",")}/${url.hostname}:${url.port}${
          url.pathname.replace("@", "")
        }${url.search == "" ? "" : `?${url.search.replace("@", "")}`}`,
    );
  }
  return result;
}

function getIndices(original) {
  const url = new URL(original);
  const path = url.pathname.slice(1);
  if (path.startsWith("/")) path = path.slice(1);
  const indices = [];
  for (let i = 0; i < path.length; i++) {
    if (path.charAt(i) == "@") {
      indices.push(i);
    }
  }
  return indices;
}

function combineUrlPath(firstPart, secondPart) {
  if (firstPart.endsWith("/")) {
    return `${firstPart}${secondPart}`;
  } else {
    return `${firstPart}/${secondPart}`;
  }
}
