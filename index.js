var path = require("path")
    , FileStore = require("file-store")

    , HOME = process.env.HOME || process.env.USERPROFILE
    , unix = [
        "substack"
        , "dominictarr"
        , "raynos"
        , "mikeal"
        , "maxogden"
        , "isaacs"
    ]
    , ruby = [
        "tjholowaychuk"
        , "jashkenas"
        , "rauchg"
        , "bnoguchi"
    ]
    , nodejitsu = [
        "marak"
        , "indexzero"
        , "avianflu"
        , "pgte"
        , "hij1nx"
        , "dscape"
        , "fedor.indutny"
        , "jesusabdullah"
        , "tmpvar"
    ]
    , $top = [
        "tjholowaychuk"
        , "substack"
        , "raynos"
        , "dominictarr"
        , "coolaj86"
        , "architectd"
        , "jaredhanson"
        , "damonoehlman"
        , "isaacs"
        , "marak"
    ]
    , categories = {
        unix: unix
        , ruby: ruby
        , nodejitsu: nodejitsu
        , top: $top
    }

    , config = FileStore(path.join(HOME, ".config", "node-communities.txt"))
    , DEFAULT = "DEFAULT"

module.exports = {
    add: add
    , get: get
    , rm: rm
    , ls: ls
    , DEFAULT: DEFAULT
}

function get(category, callback) {
    if (!category) {
        category = DEFAULT
    }

    if (category in categories) {
        return callback(null, categories[category])
    }

    config.get(category, readAuthors)

    function readAuthors(err, authors) {
        if (err) {
            return callback(err)
        }

        callback(null, authors || [])
    }
}

function add(author, category, callback) {
    if (!author) {
        throw new Error("`add AUTHOR` requires an author")
    }

    if (!category) {
        category = DEFAULT
    }

    config.push(category, author, callback)
}

function rm(author, category, callback) {
    if (!author) {
        throw new Error("`npm-used rm AUTHOR` requires an author")
    }

    if (!category) {
        category = DEFAULT
    }

    config.delete(category, author, callback)
}

function ls(category) {
    if (!category) {
        category = DEFAULT
    }

    get(category, readAuthors)

    function readAuthors(err, authors) {
        if (err) {
            throw err
        }

        if (authors.length === 0) {
            return console.log("Category :-", category, "is empty")
        }

        console.log("Category :-", category, "contains: \n")
        for (var i = 0; i < authors.length; i++) {
            console.log(" - Author:", authors[i])
        }
    }
}
