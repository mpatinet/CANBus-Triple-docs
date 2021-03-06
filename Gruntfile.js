module.exports = function(grunt){

  
  grunt.initConfig({
    
    options: {
      dist: './dist/app'
    },
  
    pkg: grunt.file.readJSON('package.json'),

      watch: {
        html: {
          files: ['./src/pages/**/*', './src/content/**/*'],
          tasks: ['html']
        },
        js: {
          files: ['<%= jshint.files %>'],
          tasks: ['js']
        },
        assets: {
          files: ['./src/assets/**/*'],
          tasks: ['copy']
        },
        sass: {
          files: ['./src/sass/**/*.scss'],
          tasks: ['style']
        },
        css: {
          files: ['<%= options.dist %>/styles/*.css']
        },
        livereload: {
          files: ['<%= options.dist %>/**/*'],    
          options: {livereload: true}
        }
      },
        
      concat: {
        options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
        },
        dist: {
          // the files to concatenate
          src: ['src/**/*.js'],
          // the location of the resulting JS file
          dest: '<%= options.dist %>/js/<%= pkg.name %>.js'
        }
      },
        
      uglify: {
        options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
          files: {
            '<%= options.dist %>/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
          }
        }
      },

      jshint: {
        // define the files to lint
        files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!**/foundation*.js'],
        // configure JSHint (documented at http://www.jshint.com/docs/)
        options: {
          // more options here if you want to override JSHint defaults
          globals: {
            jQuery: true,
            console: true,
            module: true
          }
        }
      },
          
      sass: {                                 
        dist: {                             
            files: {                        
                '<%= options.dist %>/styles/main.css': './src/sass/main.scss'
            }
        }
      },

      autoprefixer: {
        dist: {
          options: {
            browsers: ['last 2 versions', '> 1%']
          },
          files: {
            '<%= options.dist %>/styles/main.css' : '<%= options.dist %>/styles/main.css'
          }
        }
      },

      cssmin: {
        add_banner: {
          options: {
          banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          report: 'gzip'
          },
          files: {
            '<%= options.dist %>/styles/main.min.css' : '<%= options.dist %>/styles/main.css'
          }
        }
      },

      assemble: {
        options: {
          layout: './src/pages/layout/default.hbs',
          partials: './src/pages/partials/**/*.hbs',
          data: ['./src/pages/json/**/*.{json,yml}','package.json'],
          flatten: true,
          helpers: [],
          assets: 'src/assets',
          collections: [{
            name: 'docs',
            sortby: 'weight',
            sortorder: 'descending'
          }],
        },
        pages: {
          files: [{
            src: './src/pages/*.hbs',
            dest: '<%= options.dist %>/'
          },{
            cwd: './src/pages/*.hbs',
            src: '**/*.hbs',
            dest: '<%= options.dist %>/',
            expand: true
          },{
            cwd: './src/content/docs/',
            src: ['**/*.hbs', '**/*.md'],
            dest: '<%= options.dist %>/',
            expand: true
          }]
        },
        posts:{
          
        }
      },

      htmlmin: {
        dist: {
          options: {
            removeComments: true,
            collapseWhitespace: true,
            removeEmptyAttributes: true,
            removeCommentsFromCDATA: true,
            removeRedundantAttributes: true,
            collapseBooleanAttributes: true
          },
          files: {
            // Destination : Source
            '<%= options.dist %>/index.html': '<%= options.dist %>/index.html'
          }
        }
      },
      
      copy: {
        dist: {
          files: [{
            expand: true,
            dot: true,
            cwd: './src/assets/',
            dest: '<%= options.dist %>',
            src: [
              '**/*.{ico,png,txt,jpg,jpeg,svg}',
              '**/images/{,*/}*.webp',
            ]
          }]
        }
      },
          
      connect: {
        server: {
          options: {
            port: 8000,
            base: '<%= options.dist %>/'
          }
        }
      },
    
      clean: {
        all: ['<%= options.dist %>/*.html']
      },

      'gh-pages': {
        options: {
          base: 'dist'
        },
        src: ['**']
      }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('html', ['assemble', 'htmlmin']);

  grunt.registerTask('js', ['jshint', 'concat', 'uglify']);

  grunt.registerTask('style', ['sass', 'autoprefixer', 'cssmin']);

  grunt.registerTask('serve', [ 'default', 'connect', 'watch']);

  grunt.registerTask('pub', ['default','gh-pages']);

  grunt.registerTask('default', ['js', 'style', 'clean', 'html', 'copy']);

};