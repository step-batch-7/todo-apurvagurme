class App {
  constructor() {
    this.routes = [];
  }

  addRoute(method, path, handlers){
    handlers.forEach(handler => this.routes.push({ path, handler, method}));
  }

  get(path, ...handlers) {
    this.addRoute('GET', path, handlers);
  }

  post(path, ...handlers) {
    this.addRoute('POST', path, handlers);
  }

  use(middleware) {
    this.routes.push({ handler: middleware });
  }

  serve(req, res) {
    console.log(req.headers);
    // parseCookies(req);
    const matchingHandlers = this.routes.filter(route => {
      return matchRoute(route, req);
    });
    const next = function() {
      const router = matchingHandlers.shift();
      router.handler(req, res, next);
    };
    next();
  }
}

const matchRoute = function(route, req) {
  if (route.method) {
    const doesPathMatch = route.path === '' || req.url === route.path;
    return req.method === route.method && doesPathMatch;
  }
  return true;
};

module.exports = { App };
