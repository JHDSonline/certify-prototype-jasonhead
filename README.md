# Certify Prototype

This is a static prototype of SBA's [Certify](https://certify.sba.gov) built with [USWDS + Jekyll](http://www.jaredcunha.com/uswds-jekyll/). For full documentation, visit the [USWDS + Jekyll repo](http://www.jaredcunha.com/uswds-jekyll/).

## To Run

```
bundle install
bundle exec jekyll s
```

## To Navigate

Look at the GitHub repositotry to look at the folder structure and enter that in the url after the default `http://127.0.0.1:4000/` to navigate to that page for example: `http://127.0.0.1:4000/2017/06/full-initial-application/`.

## To Deploy
```
bundle exec cds-gh-pages
```

Just adding as a test

## Configuration

Using Jekyll’s `data` feature, it is relatively easy to put together a basic page with `Front Matter`.

### Mastheads

The Masthead has three primary components:

* The Top Navigation
* The mid-section, which is the masthead type
* The tabs

To create a prototype, only the `top_nav` is required, which `masthead_body` and `tab_set` are optional. If you are using tabs on a page, then the `masthead_body` is required.

The values of each of the `Front Matter` items refer directly to a file in the `_data` directory. You will want to look at the `.yml` content because the it might require fixed naming conventions for certain links in the prototype.

You can create additional `.yml` files, but there are several common examples available already.

* __top_nav:__ `firm`, `sba-analyst`, `sba-new-user`, `sba-supervisor`
* __masthead_content:__ `all-cases`, `annual-review--sba`, `initial-application--sba`
* __tabs:__ `all-cases`, `analyst-application`, `firm-application`, `requirements`

#### Sample 8(a) Annual Review viewed by supervisor
```
layout: default

top_nav: sba-supervisor
masthead_body: annual-review--sba
tab_set: analyst-application
```

#### Sample 8(a) Initial Application viewed by analyst
```
layout: default

top_nav: sba-analyst
masthead_body: intial-application--sba
tab_set: analyst-application
```
