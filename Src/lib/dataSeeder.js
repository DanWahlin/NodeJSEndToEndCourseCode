'use strict';

var uuid            = require("node-uuid"),
    User            = require("../models/user"),
    Product         = require("../models/product"),
    Category        = require("../models/category"),
    ProductType     = require("../models/productType"),
    Feature         = require("../models/feature"),
    DiscountCode    = require("../models/discountCode"),
    userRepository  = require("../lib/userRepository");

var dataInitializer = function () {

    var initializeUserData = function(callback) {

            //Add user to the system
            var user1 = new User({
                firstName: "John",
                lastName: "Doe",
                email: "test@test.com",
                password: "password",
                subscribeToNewsletter: true,
                roles: ["admin"]
            });

            //Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
            userRepository.hashPasswordAndSave(user1, function(err, user) {
              if (err) {
                return callback(err);
              }
              return callback(null);
            });

        },

        initializeProductData = function(callback) {

/*
 ########################################################################################
                               Product Types (for top menu on site)
 ########################################################################################
 */
            var videoProductType = new ProductType({
                title       : "Videos",
                linkTitle   : "Videos",
                iconCssClass: "fa-play-circle",
                description : "Get the highest quality video training out there!"
            });

            var trainingProductType = new ProductType({
                title: "Training",
                linkTitle   : "Training",
                iconCssClass: "fa-users",
                description : "Looking for expert onsite training for your team? We provide training on a range of technologies and have experts who know how to teach - not just talk!"
            });

            var trainingMaterialsProductType = new ProductType({
               title: "Courseware",
               linkTitle   : "Courseware",
               iconCssClass: "fa-file-text",
               description : "License our top-notch courseware, hands-on labs and code samples."
            });
            
            //var labsProductType = new ProductType({
            //    title: "Labs",
            //    linkTitle   : "Labs",
            //    iconCssClass: "fa-flask",
            //    description : "Interested in getting your hands dirty writing code? Check out our hands-on labs!"
            //});

            videoProductType.save();
            trainingProductType.save();
            trainingMaterialsProductType.save();
            //labsProductType.save();

/*
 ########################################################################################
                                    General Categories
 ########################################################################################
 */

            var nodeCategory = new Category({
                title   : "Node.js Courses",
                imageUrl: "",
                cssClass: "nodeCategory"
            });

            var jsCategory = new Category({
                title: "JavaScript Courses",
                imageUrl: "",
                cssClass: "javascriptCategory"
            });

            nodeCategory.save();
            jsCategory.save();

/*
 ########################################################################################
                                    Products
 ########################################################################################
 */

            var angularJumpStartModules = [
                {
                    moduleId    : uuid.v4(),
                    position    : 0,
                    title       : "AngularJS - The Big Picture",
                    description : "In this module you'll be introduced to the AngularJS SPA framework.",
                    sections    : [
                        {
                            sectionId   : uuid.v4(),
                            position    : 0,
                            isFree      : true,
                            length      : "01:25",
                            title       : "Course Introduction",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 1,
                            isFree      : true,
                            length      : "03:49",
                            title       : "Course Outline and Application Overview",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 2,
                            length      : "00:49",
                            title       : "Meet the Instructor",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 3,
                            length      : "00:34",
                            title       : "Pre-Requisites",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 4,
                            length      : "01:18",
                            title       : "Introduction",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 5,
                            length      : "04:35",
                            title       : "SPA Overview",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 6,
                            length      : "02:59",
                            title       : "Jumping into AngularJS",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 7,
                            length      : "07:02",
                            title       : "AngularJS Hello World",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 8,
                            length      : "07:11",
                            title       : "Key Players in AngularJS",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 9,
                            length      : "02:53",
                            title       : "AngularJS Documentation",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 10,
                            length      : "00:44",
                            title       : "Summary",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        }
                    ]
                },
                {
                    moduleId    : uuid.v4(),
                    position    : 1,
                    title       : "Views, Directives and Filters",
                    description : "This module will walk you through the process of working with AngularJS views and leverage built-in directives and filters.",
                    sections    : [
                        {
                            sectionId   : uuid.v4(),
                            position    : 0,
                            length      : "01:46",
                            title       : "Introduction",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 1,
                            length      : "05:25",
                            title       : "Data Binding Overview",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 2,
                            length      : "06:23",
                            title       : "Directives and Expressions",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 3,
                            length      : "07:52",
                            title       : "Directives and Expressions in Action",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 4,
                            length      : "05:53",
                            title       : "Additional Directives",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 5,
                            length      : "01:41",
                            title       : "Iterating Over Data",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 6,
                            length      : "05:21",
                            title       : "ng-repeat in Action",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 7,
                            length      : "05:11",
                            title       : "Sorting and Formatting Data",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 8,
                            length      : "05:25",
                            title       : "Formatting Data with Filters",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 9,
                            length      : "03:56",
                            title       : "Sorting and Filtering Data with Filters",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 10,
                            length      : "03:17",
                            title       : "Dynamic Sorting with the orderBy Filter",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 11,
                            length      : "00:40",
                            title       : "Summary",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        }
                    ]
                },
                {
                    moduleId: uuid.v4(),
                    position: 2,
                    title: "Controllers, Scope and Modules",
                    description: "In this module you'll learn about the role of controllers, modules and scope in AngularJS applications."
                },
                {
                    moduleId: uuid.v4(),
                    position: 3,
                    title: "Routing",
                    description: "In this module you'll learn about the route provider in AngularJS and learn how it can be used to load different views and controllers."
                },
                {
                    moduleId: uuid.v4(),
                    position: 4,
                    title: "Factories and Services",
                    description: "In this module you'll learn how to create re-useable factories and services and the differences between the two."
                },
                {
                    moduleId: uuid.v4(),
                    position: 5,
                    title: "UI and Animation",
                    description: "This module will show you how CSS and AngularJS can be used to create animations to add polish to your applications."
                },
                {
                    moduleId: uuid.v4(),
                    position: 6,
                    title: "Bonus: Getting Started Building Custom Directives",
                    description: "This bonus module will introduce you to the core concepts that you need to know to get started building custom directives."
                },
                {
                    moduleId: uuid.v4(),
                    position: 6,
                    title: "Bonus: Shared Scope, Isolate Scope, the link() Function in Custom Directives",
                    description: "Understanding the difference between shared and isolate scope is important when building directives. This module will explain the differences and introduce the link() function."
                }
            ];
            var angularJumpStartProduct = new Product({
                sku                 : "angular-jumpStart",
                authors             : [ "Dan Wahlin" ],
                productTypeId       : videoProductType.id,
                categoryId          : jsCategory.id,
                tags                : [ "AngularJS", "JavaScript", "SPA" ],
                level               : ["Beginner", "Intermediate"],
                publishDate         : new Date(),
                title               : "AngularJS JumpStart",
                shortDescription    : "Learn to build AngularJS SPA applications and leverage data binding, controllers and more.",
                description         : "AngularJS is a robust Single Page Application (SPA) framework that can be used to build dynamic, client-centric applications. In this course you'll learn key concepts that you need to know to get started building AngularJS applications such as controllers, scope, views, routes, factories, services and more. The course provides step-by-step walk-throughs and coding demos that you're encouraged to code along with to enhance the learning process. By the end of the course you'll understand how all of the AngularJS pieces fit together and be able to apply this knowledge to building your own custom SPAs.",
                pricing             : {
                    udemyPrice      : 99
                },
                urls                : {
                    materialsUrl        : "",
                    imageUrl            : "",
                    sampleVideoUrl      : "//player.vimeo.com/video/82861308",
                    videosDownloadUrl   : "",
                    udemyUrl            : "https://www.udemy.com/angularjs-jumpstart"
                },
                modules                 : angularJumpStartModules
            });

            var angularDirectivesModules = [
                {
                    moduleId    : uuid.v4(),
                    position    : 0,
                    title       : "Course Introduction",
                    description : "This module will provide a quick glimpse into topics the course will cover, introduce the course author, discuss pre-reqs for the course, and walk-through the course modules.",
                    sections    : [
                        {
                            sectionId   : uuid.v4(),
                            position    : 0,
                            isFree      : true,
                            length      : "02:24",
                            title       : "Course Introduction",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 1,
                            isFree      : true,
                            length      : "02:18",
                            title       : "About the Author",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 2,
                            length      : "01:26",
                            title       : "Course Prerequisites",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 3,
                            length      : "04:41",
                            title       : "Course Agenda",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 4,
                            length      : "02:07",
                            title       : "Code Editor",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        }
                    ]
                },
                {
                    moduleId    : uuid.v4(),
                    position    : 1,
                    title       : "Getting Started with Directives",
                    description : "In this module you'll learn about 3 general directive categories, learn about the $compile service, and see the role that the Directive Definition Object (DDO) plays in directives.",
                    sections    : [
                        {
                            sectionId   : uuid.v4(),
                            position    : 0,
                            length      : "02:18",
                            title       : "Introduction",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 1,
                            length      : "04:42",
                            title       : "The Role of Directives",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 2,
                            length      : "04:09",
                            title       : "Creating a Hello World Directive",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 3,
                            length      : "06:08",
                            title       : "Directive Categories",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 4,
                            length      : "10:06",
                            title       : "Directive Building Blocks",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        },
                        {
                            sectionId   : uuid.v4(),
                            position    : 5,
                            length      : "01:22",
                            title       : "Summary",
                            videoUrl    : "//player.vimeo.com/video/82861308"
                        }
                    ]
                },
                {
                    moduleId: uuid.v4(),
                    position: 2,
                    title: "Shared and Isolate Scope",
                    description: "Isolate Scope is a key part of custom directives so this module will walk-through what it is and how it's used. You'll also learn about 3 local scope properties."
                },
                {
                    moduleId: uuid.v4(),
                    position: 3,
                    title: "The link() Function",
                    description: "Learn all about DOM manipulation and the role that the link() function plays."
                },
                {
                    moduleId: uuid.v4(),
                    position: 4,
                    title: "Using Controllers in Directives",
                    description: "In this module you'll see how controllers can be used in custom directives and how they can minimize the amount of code you write in many cases."
                },
                {
                    moduleId: uuid.v4(),
                    position: 5,
                    title: "Bonus Content - Custom Directives in Action and More",
                    description: "This module contains additional examples of directives in an application and shows how powerful they can be."
                }
            ];
            var angularDirectivesProduct = new Product({
                sku                 : "angular-custom-directives",
                authors             : [ "Dan Wahlin" ],
                tags                : [ "AngularJS", "JavaScript", "SPA", "Directives" ],
                productTypeId       : videoProductType.id,
                categoryId          : jsCategory.id,
                level               : ["Intermediate", "Advanced"],
                title               : "AngularJS Custom Directives",
                shortDescription    : "Learn how to build AngularJS apps through hands-on exercises.",
                description         : "The AngularJS JumpStart Hands-On Labs course let's you get hands-on exprience working with the framework and building Single Page Applications (SPAs). In this course you'll be provided with step-by-step lab exercises and follow along at your own pace with videos that describe each step along the way and help you out if you get stuck at all.",
                pricing             : {
                    buyPrice        : 29
                },
                urls                : {
                    materialsUrl        : "",
                    imageUrl            : "",
                    sampleVideoUrl      : "//player.vimeo.com/video/82861308",
                    videosDownloadUrl   : ""
                },
                modules             : angularDirectivesModules
            });

            var masteringJavaScriptProduct = new Product({
                sku                 : "mastering-javascript",
                authors             : [ "Dan Wahlin" ],
                categoryId          : jsCategory.id,
                productTypeId       : trainingProductType.id,
                tags                : [ "JavaScript", "ES6", "TypeScript" ],
                level               : ["Beginner", "Intermediate", "Advanced"],
                title               : "Mastering JavaScript",
                shortDescription    : "Dive into key features of JavaScript that will take your skills to the next level.",
                description         : "The Web has changed a lot over the years as user interfaces have moved from displaying static data to more dynamic and flexible data.  At the center of this change is JavaScript – one of the most popular scripting languages around. To develop today's modern Web applications a solid understanding of JavaScript is essential especially given that JavaScript can be used on the client-side and server-side now.<br /><br />In the Mastering JavaScript (with ECMAScript 6 and TypeScript) course you'll dive into key features of the language that will take your JavaScript skills to the next level. Learn the ins-and-outs of prototypical inheritance, how to create factories, working with constructors, dealing with \"this\", and key patterns that can be used to structure your AngularJS code such as the Revealing Module Pattern, Prototype Pattern, and others.  You'll also learn about data binding techniques that can be used in JavaScript and libraries that can be used to significantly reduce the amount of code you write. Finally, you'll learn about new ECMAScript 6 (ES6) features (and how you can even use them today in your applications even if the browsers you target don't support it) as well as about TypeScript and how it can be used to add strong types into code.",
                urls                : {
                    imageUrl            : "",
                    materialsUrl        : "",
                    sampleVideoUrl      : "",
                    videosDownloadUrl   : ""
                },
                trainingDetails         : {
                    preRequisites       : "Previous programming experience with JavaScript is recommended to get the most out of this course. Although a short JavaScript primer will be provided at the beginning of the course, you should already be comfortable using the language.",
                    youWillLearn       : "<ul> <li>The role of prototypical inheritance</li> <li>How to create JavaScript factories</li> <li>The role of the constructor</li> <li>Prototypal Inheritance</li> <li>Key JavaScript patterns that can be used to clean up your code</li> <li>How to create custom JavaScript objects</li> <li>Client-Side Data binding techniques that can minimize code</li> <li>Key ECMAScript 6 Features</li> <li>Using ECMASCript 6 Today with specialized tools</li> <li>Getting Started with TypeScript</li> </ul>",
                    audience            : "This course is valuable for developers who are interested in building applications using the JavaScript programming language.",
                    length              : 3,
                    outline             : "<ol> <li>JavaScript Primer</li> <li>JavaScript Objects</li> <li>Function Techniques</li> <li>JavaScript Patterns</li> <li>Data Binding and Templates</li> <li>Getting Started with TypeScript</li> </ol>"
                }
            });

            var nodejsProduct = new Product({
                sku                 : "nodejs-end-to-end",
                authors             : [ "Dan Wahlin" ],
                categoryId          : nodeCategory.id,
                productTypeId       : trainingProductType.id,
                tags                : [ "JavaScript", "Node.js", "MongoDB", "Express"],
                level               : ["Beginner","Intermediate"],
                title               : "Node.js End-to-End Programming",
                shortDescription    : "Learn how to build an end-to-end application using Node.js.",
                description         : "Node.js is one of the most revolutionary frameworks to come out in quite a while! Its asynchronous nature and flexibility makes it relevant for building everything from Web applications to client tools and you'll find it being used in a variety of ways. Node.js is based on JavaScript so if you're already comfortable with the JavaScript language you can be productive with Node.js right away.<br /><br />In the Node.js/MEAN End-to-End Web Development Workshop you'll learn how to build a Web application from start to finish using MongoDB, Express, Angular, and Node.js (the MEAN stack). Topics covered include building model classes , conneNOdecting to MongoDB with Mongoose, securing a site with Passport, building a shopping cart with Angular and Node.js RESTful services, creating controllers and routes with Express, binding data to views using Handlebars.js, and much more. If you're looking to learn the ins-and-outs of Node.js then this course is for you!",
                pricing : {
                      "licensePrice" : 30
                },
                trainingDetails         : {
                    preRequisites       : "Attendees must be comfortable working with JavaScript to take this class. A minimum of 6-months of hands-on JavaScript experience is recommended to get the most out of the course.",
                    youWillLearn        : "<ul><li>Understand key Node.js Concepts</li> <li>Run Node.js Scripts</li> <li>Learn the MEAN (MongoDB, Express, AngularJS, Node.js) Stack</li> <li>Explore Node.js Modules (Express, Mongoose, Passport, and others)</li> <li>Create MVC-style Applications with Express</li> <li>Secure Applications with Passport</li> <li>Query MongoDB with Mongoose</li> <li>Build a Shopping Cart with Angular and Node.js</li> <li>Use Handlebars.js templates on the server to bind data</li> <li>Much more!</li> </ul>",
                    audience            : "This course is designed for Web and JavaScript developers who are looking to build Node.js Web applications.",
                    length              : 4,
                    outline             : "<ol> <li>Getting Started with Node.js</li> <li>Using Node.js Modules</li> <li>Creating the Node.js Application Structure</li> <li>Model Objects and Mongoose</li> <li>Data Repository Objects</li> <li>Routes and Controllers</li> <li>Working with Views</li> <li>Creating a Passport Security Module</li> <li>Building a Shopping Cart with Angular and Node.js</li> </ol>"
                }
            });
            
            var angularjsProduct = new Product({
                  sku : "angularjs-end-to-end-programming",
                  authors             : [ "Dan Wahlin" ],
                  level               : ["Beginner","Intermediate"],
                  categoryId          : jsCategory.id,
                  productTypeId       : trainingProductType.id,
                  tags                : [ "AngularJS", "JavaScript", "SPA"],
                  title : "AngularJS End-to-End Programming",
                  shortDescription : "Learn how to build an end-to-end Angular application in this hands-on, classroom-based training course.",
                  description : "The AngularJS End-to-End Application Development course provides a hands-on look at working with the AngularJS framework. The course starts with an introduction to building Single Page Applications (SPA) and talks about the features AngularJS provides. From there students learn about different aspects of the framework such as views and directives, controllers and routes, as well as factories and services. Along the way, different debugging techniques and tools are discussed, how different AngularJS components can be customized and shared with other components, and different JavaScript patterns that can be applied to applications to make them more maintainable. By the end of the class students will have walked through the process of building a Single Page Application (SPA) from end-to-end using AngularJS and be ready to apply that knowledge to applications they need to build at work.",
                  pricing : {
                      "licensePrice" : 30
                  },
                  trainingDetails : {
                      preRequisites : "Attendees much be comfortable working with JavaScript to take this class. A minimum of 6-months of hands-on JavaScript experience is recommended to get the most out of the course.",
                      youWillLearn : "<ul> <li>Single Page Application Features</li> <li>Key features of AngularJS</li> <li>The Role of Modules</li> <li>The Role of Directives in Views</li> <li>Building Custom Directives</li> <li>Using $scope for Data Binding</li> <li>Techniques for Defining Controllers</li> <li>Building Custom Filters</li> <li>How to build re-useable data services with Factories and Services</li> <li>Using $http to Interact with RESTful Services</li> <li>Using AngularJS HTTP interceptors</li> </ul>",
                      audience : "This course is designed for JavaScript developers that are looking to build Single Page Applications using AngularJS.",
                      length : 4,
                      outline : "<ol> <li>AngularJS JumpStart <ul> <li>Introduction to Single Page Applications <li>AngularJS and SPAs <li>Data Binding, Directives, and Filters <li>Views, Controllers and Scope <li>Modules, Routes and Factories </ul> </li> <li>The Customer Manager Application <ul> <li>Application Overview <li>Application Technologies <li>Application Structure <li>Node.js/Express/MongoDb <li>Web API/Entity Framework/SQL Server </ul> </li><li>Unit Testing <ul> <li>AngularJS Unit Testing features <li>Using Karma and Jasmine <li>Creating a Test Suite and Specs <li>Using ngMock, beforeEach() and Dependency Injection <li>Mocking Objects </ul> </li><li>Creating Modules and Services <ul> <li>The customerManager Module <li>Customer Manager Factory/Service Overview <li>The customersService <li>Making Ajax Calls with $http <li>The authService <li>The dataService Factory and BreezeJS </ul> </li> <li>Defining Routes <ul> <li>Adding the ngRoute Dependency <li>Configuring Application Routes with $routeProvider <li>Defining Route Parameters <li>Adding ng-view <li>Securing Client-Side Routes </ul> </li> <li>Application Controllers <ul> <li>AngularJS Controllers <li>The Scope Life Cycle <li>Application Controllers </ul> </li> <li>Navbar Controller and View <ul> <li>Navbar Functionality <li>The NavbarController <li>The Navbar View and Directives </ul> </li> <li>Login Controller and View <ul> <li>Login Functionality <li>The LoginController <li>The Login View and Directives </ul> </li> <li>Customers Controller and View <ul> <li>Customers View Functionality <li>The CustomersController <li>The Customers View and Directives <li>Paging Customers <li>Filtering Customers <li>Switching Display Modes </ul> </li> <li>Creating Custom Directives <ul> <li>The Role of Directives <li>Creating Custom Directives <li>Creating a Custom Validation Directive <li>Using $http Interceptors in a Custom Directive <li>Simplifying Code with a Directive </ul> </li> <li>Adding Animations <ul> <li>Animation Overview <li>The ngAnimate Module <li>Defining Animations in CSS <li>Referencing Animation Classes </ul> </li> </ol>"
                  }
              });

            angularJumpStartProduct.save();
            angularDirectivesProduct.save();
            masteringJavaScriptProduct.save();
            nodejsProduct.save();
            angularjsProduct.save();


/*
 ########################################################################################
                                        Discount Codes
 ########################################################################################
 */

            // var discountCode = DiscountCode( {
            //     productId: angularJumpStartProduct.id,
            //     code: "codewithdan",
            //     udemyPrice: 19,
            //     isActive: true,
            //     allowedUses: null,
            //     numberOfUses: 0,
            //     date: new Date()
            // });

            // discountCode.save();

/*
########################################################################################
                                    Features
########################################################################################
 */


            var feature1 = new Feature({
                position      : 1,
                isFeatured    : true,
                title         : "AngularJS JumpStart",
                text          : "The most productive way to learn AngularJS! JumpStart your learning with this step-by-step video course!",
                highlightText : "Over 6 hours of content!",
                productId     : angularJumpStartProduct.id,
                backgroundImageUrl : "/img/background_girl_1920x500.jpg"
            });

            var feature2 = new Feature({
                position : 3,
                isFeatured: true,
                title : "AngularJS Custom Directives",
                text : "Dive in to AngularJS and learn how to build custom directives!",
                highlightText : "Advanced AngularJS Content!",
                productId : angularDirectivesProduct.id,
                backgroundImageUrl : "/img/background_man_couch_1920x500.jpg"
            });

            var feature3 = new Feature({
                position : 0,
                isFeatured: true,
                title : "Focused Onsite Training",
                text : "World-class JavaScript, Angular, Node.js, C#, ASP.NET MVC (and more) training at your location. Whether you're located in the middle of nowhere or in a high-rise corporate building.",
                link : "/products/training",
                linkText : "Get Details",
                backgroundImageUrl : "/img/background_road_1920x500.jpg",
                customCssClass : "white"
            });
            
            var feature4 = new Feature({
                position : 2,
                isFeatured: true,
                title : "World-Class Onsite Training",
                text : "We provide the worlds best hands-on training at your location. Anywhere in the world!",
                link : "/products/training",
                linkText : "Get Details",
                backgroundImageUrl : "/img/background_singapore_1920x500.jpg"
            });

            feature1.save();
            feature2.save();
            feature3.save();
            feature4.save();

        };


    return {
        initializeUserData: initializeUserData,
        initializeProductData: initializeProductData
    };

}();

module.exports = dataInitializer;

