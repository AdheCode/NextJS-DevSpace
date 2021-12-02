import fs from "fs";
import path from "path";
import matter from "gray-matter";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

export default function handler(req, res) {
  let posts;

  if (serverRuntimeConfig.node_env === "production") {
    // Fetch from cache
    posts = require('../../cache/data').posts;
  } else {
    const files = fs.readdirSync(path.join("posts"));
    posts = files.map((file) => {
      const slug = file.replace('.md', '');
      const markdownWithMeta = fs.readFileSync(
        path.join("posts", file),
        "utf8"
      );
      const { data: frontmatter } = matter(markdownWithMeta);
      return { frontmatter, slug };
    });
  }

  const results = posts.filter(
    ({ frontmatter: { title, excerpt, category } }) =>
      title.toLowerCase().indexOf(req.query.q) != -1 ||
      excerpt.toLowerCase().indexOf(req.query.q) != -1 ||
      category.toLowerCase().indexOf(req.query.q) != -1
  );

  res.status(200).json(JSON.stringify({results}));
}
