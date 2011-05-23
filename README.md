# This is the data for my website/blog

It is automatically transformed by [DocPad](http://github.com/balupton/docpad) into a static website whenever I push this repository to GitHub.

I was tired of having my blog posts end up in a database off on some remote server. That is backwards. I've lost valuable posts that way. I want to author my posts locally in Markdown. My blog should be easily stylable and customizable any way I please. It should take care of creating a feed for me. And most of all, my site should be stored on GitHub so that I never lose data again.

It's hosted on a [no.de](http://no.de) smart machine as I'm also testing out [FilePad](http://github.com/balupton/filepad) integration which requires a [MongoDB](http://www.mongodb.org/) instance to be running to support regeneration. If you don't want to include filepad, then you can publish to any node.js host such as [Nodester](http://nodester.com/) or [Duostack](https://www.duostack.com/) (both of which are free) by removing the filepad references in `server.coffee`. You can even publish to non node.js hosts, if you just publish the `out` directory to them - such as [GitHub Pages](https://github.com/blog/272-github-pages) (which is also free).

# License

Everything except the directories listed below are licensed under the [MIT License](http://creativecommons.org/licenses/MIT/) and Copyright 2011 [Benjamin Arthur Lupton](http://balupton.com). Feel free to use their contents as you please. If you do use them then a link back to http://github.com/balupton/docpad would be appreciated but is not required.

The exceptions are:

- `src/documents`: You may not reuse anything therein without my permission
- `src/files/styles/mojombo`: [MIT Licensed](http://creativecommons.org/licenses/MIT/) like the rest, but Copyright 2011 [Tom Preston-Werner](https://github.com/mojombo/mojombo.github.com)

Thanks :)