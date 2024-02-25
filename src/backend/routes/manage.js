const admin = require("admin-bro");
const adminExpress = require("admin-bro-expressjs");
const adminMongoose = require("admin-bro-mongoose");
const mongoose = require("mongoose");
const car = require("../models/car");
const packet = require("../models/packet");
const mark = require("../models/mark");
const page = require("../models/page");
admin.registerAdapter(adminMongoose);

const {
  after: passwordAfter,
  before: passwordBefore,
} = require("../middleware/password");
const {
  after: imageAfter,
  before: imageBefore,
} = require("../middleware/upload");
const {
  after: markAfter,
  before: markBefore,
} = require("../middleware/markAliases");
const {
  after: packetAfter,
  before: packetBefore,
} = require("../middleware/packetUpload");

const manage = new admin({
  database: [mongoose],
  rootPath: "/manage",
  logoutPath: "/manage/logout",
  loginPath: "/manage/login",
  branding: {
    companyName: "VM MAXIMA CAR",
    logo: "/images/logo.png",
    softwareBrothers: false,
  },
  resources: [
    {
      resource: car,
      options: {
        parent: {
          name: "Cars",
          icon: "Folder",
        },
        properties: {
          uuid: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          images: {
            components: {
              edit: admin.bundle("../../frontend/components/car/imageEdit.tsx"),
              list: admin.bundle("../../frontend/components/car/imageList.tsx"),
            },
          },
          description: {
            type: "richtext",
            isVisible: { list: false, filter: true, show: true, edit: true },
          },
          mark: {
            components: {
              edit: admin.bundle("../../frontend/components/car/markEdit.tsx"),
            },
          },
          markAliases: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          model: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          packets: {
            isVisible: { list: false, filter: true, show: true, edit: true },
            components: {
              edit: admin.bundle(
                "../../frontend/components/car/packetEdit.tsx"
              ),
            },
          },
          color: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            components: {
              edit: admin.bundle("../../frontend/components/car/colorEdit.tsx"),
            },
          },
          transmission: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            components: {
              edit: admin.bundle(
                "../../frontend/components/car/transmissionEdit.tsx"
              ),
            },
          },
          fuel: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            components: {
              edit: admin.bundle("../../frontend/components/car/fuelEdit.tsx"),
            },
          },
          rating: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          keywords: {
            isVisible: { list: false, filter: true, show: true, edit: true },
          },
          searchKeywords: {
            isVisible: { list: false, filter: false, show: false, edit: false },
          },
          details: {
            isVisible: { list: false, filter: true, show: true, edit: true },
          },
          de: {
            isVisible: { list: false, filter: true, show: true, edit: false},
          },
          cs: {
            isVisible: { list: false, filter: true, show: true, edit: false},
          },
          ratings: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          rating: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          stars: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          }
        },
        actions: {
          new: {
            after: async (response, request, context) => {
              const modifiedResponse = await passwordAfter(
                response,
                request,
                context
              );
              return imageAfter(modifiedResponse, request, context);
            },
            before: async (request, context) => {
              const modifiedRequest = await passwordBefore(request, context);
              return imageBefore(modifiedRequest, context);
            },
          },
          edit: {
            after: async (response, request, context) => {
              const modifiedResponse = await passwordAfter(
                response,
                request,
                context
              );
              return imageAfter(modifiedResponse, request, context);
            },
            before: async (request, context) => {
              const modifiedRequest = await passwordBefore(request, context);
              return imageBefore(modifiedRequest, context);
            },
          },
        },
      },
    },
    {
      resource: packet,
      options: {
        parent: {
          name: "Cars",
          icon: "Folder",
        },
        properties: {
          features: {
            isVisible: { list: false, filter: true, show: true, edit: true },
          },
          de: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          cs: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          }
        },
        actions: {
          new: {
            after: async (response, request, context) => {
              const modifiedResponse = await passwordAfter(
                response,
                request,
                context
              );
              return packetAfter(modifiedResponse, request, context);
            },
            before: async (request, context) => {
              const modifiedRequest = await passwordBefore(request, context);
              return packetBefore(modifiedRequest, context);
            }
          },
          edit: {
            after: async (response, request, context) => {
              const modifiedResponse = await passwordAfter(
                response,
                request,
                context
              );
              return packetAfter(modifiedResponse, request, context);
            },
            before: async (request, context) => {
              const modifiedRequest = await passwordBefore(request, context);
              return packetBefore(modifiedRequest, context);
            }
          }
        }
      },
    },
    {
      resource: mark,
      options: {
        parent: {
          name: "Cars",
          icon: "Folder",
        },
        properties: {
          models: {
            isVisible: { list: false, filter: true, show: true, edit: true },
          },
          aliases: {
            isVisible: { list: false, filter: true, show: true, edit: true },
          },
        },
        actions: {
          new: {
            after: async (response, request, context) => {
              const modifiedResponse = await passwordAfter(
                response,
                request,
                context
              );
              return markAfter(modifiedResponse, request, context);
            },
            before: async (request, context) => {
              const modifiedRequest = await passwordBefore(request, context);
              return markBefore(modifiedRequest, context);
            },
          },
          edit: {
            after: async (response, request, context) => {
              const modifiedResponse = await passwordAfter(
                response,
                request,
                context
              );
              return markAfter(modifiedResponse, request, context);
            },
            before: async (request, context) => {
              const modifiedRequest = await passwordBefore(request, context);
              return markBefore(modifiedRequest, context);
            }
          },
        }
      },
    },
    {
      resource: page,
      options: {
        parent: {
          name: "Extras",
          icon: "Folder",
        },
        properties: {
          content: {
            type: "richtext",
            isVisible: { list: false, filter: true, show: true, edit: true },
          },
        },
      },
    },
  ],
  locale: {
    translations: {
      labels: {
        loginWelcome: "Manage Dashboard Login",
      },
      messages: {
        loginWelcome:
          "Please enter your credentials to login and manage your website contents",
      },
    },
  },
  dashboard: {
    component: admin.bundle("../../frontend/components/dashboard.tsx"),
  },
});

const login = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const router = adminExpress.buildAuthenticatedRouter(manage, {
  authenticate: async (email, password) => {
    if (email === login.email && password === login.password)
      return login;
    return null;
  },
  cookieName: process.env.ADMIN_COOKIE_NAME,
  cookiePassword: process.env.ADMIN_COOKIE_PASSWORD,
});

module.exports = router;
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/
