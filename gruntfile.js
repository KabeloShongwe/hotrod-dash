module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appName: 'HotrodDash',
        srcDir: 'src',
        distDir: '.dist',

        webAppDir: '<%= srcDir %>/webApp',
        apiDir: '<%= srcDir %>/api',
        cssDir: '<%= webAppDir %>/styling/css',
        sassDir: '<%= webAppDir %>/styling/scss',
        appScss: '<%= sassDir %>/styles.scss',
        appCss: '<%= cssDir %>/styles.css',

        sass: {
            dev: {
                files: {
                    '<%= appCss %>': '<%= appScss %>',
                    '<%= cssDir %>/bootstrap-custom.css': '<%= sassDir %>/bootstrap-custom.scss'
                }
            },
            dist: {
                files: {
                    '<%= appCss %>': '<%= appScss %>',
                    '<%= cssDir %>/bootstrap-custom.css': '<%= sassDir %>/bootstrap-custom.scss'
                }
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                laxbreak: true,
                strict: true
            },
            webApp: {
                src: [
                    '!.*/**',
                    '<%= webAppDir %>/**/*.js',
                    '!<%= webAppDir %>/bower_components/**'
                ],
                options: {
                    globals: {
                        jQuery: true
                    }
                }
            },
            node: {
                src: [
                    '!.*/**',
                    '<%= srcDir %>/**/*.js',
                    '!<%= webAppDir %>/**'
                ],
                options: {
                    node: true,
                    globals: {
                        describe: true,
                        xdescribe: true,
                        beforeEach: true,
                        afterEach: true,
                        it: true,
                        xit: true
                    }
                }
            }
        },

        includeSource: {
            options: {
                basePath: '<%= webAppDir %>'
            },
            dev: {
                files: {
                    '<%= webAppDir %>/index.html': '<%= webAppDir %>/index.html'
                }
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= distDir %>/{,*/}*',
                        '!<%= distDir %>/.git{,*/}*',
                        '.dist-compressed/{,*/}*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= distDir %>/scripts/{,*/}*.js',
                    '<%= distDir %>/styling/css/{,*/}*.css',
                    '<%= distDir %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= distDir %>/styling/fonts/**'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= webAppDir %>/index.html',
            options: {
                dest: '<%= distDir %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        uglify: {
            /*options: {
                report: 'min',
                mangle: false
            },*/
            generated: {
                options: {
                    sourceMap: true
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= distDir %>/**/*.html'],
            css: ['<%= distDir %>/styling/css/{,*/}*.css'],
            options: {
                assetsDirs: [
                    '<%= distDir %>',
                    '<%= distDir %>/images',
                    '<%= distDir %>/styling',
                    '<%= distDir %>/styling/fonts',
                    '<%= distDir %>/styling/fonts/Lato'
                ]
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= webAppDir %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= distDir %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true,
                    removeComments: true
                }
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        ngtemplates: {
            app: {
                cwd: '<%= webAppDir %>',
                src: [
                    'layout.html',
                    'components/**/*.html',
                    'bower_components/hotrod-components/**/*.html',
                    'bower_components/hotrod-timepicker/**/*.html',
                    'bower_components/hotrod-charts/**/*.html'
                ],
                dest: '.tmp/ngtemplates/templates.js',
                options: {
                    htmlmin:  '<%= htmlmin.dist.options %>',
                    usemin: 'scripts/scripts.js'
                }
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= distDir %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= webAppDir %>',
                    dest: '<%= distDir %>',
                    src: [
                        '*.{ico,png,txt}',
                        'index.html',
                        'styling/fonts/**/*.*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= distDir %>/images',
                    src: ['generated/*']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= webAppDir %>/styling',
                dest: '.tmp/styling/',
                src: '{,*/}*.css'
            }
        },

        /*compress: {
            dist: {
                options: {
                    mode: 'gzip'
                },
                expand: true,
                cwd: '.dist/',
                src: ['**!/!*.css', '**!/!*.js', '**!/!*.html'],
                dest: '.dist-compressed/'
            }
        },*/

        watch: {
            sass: {
                files: ['<%= webAppDir %>/**/*.scss', '!<%= webAppDir %>/bower_components/**'],
                tasks: ['sass:dev'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            jshint: {
                files: ['<%= srcDir %>/**/*.js', '!<%= webAppDir %>/bower_components/**'],
                tasks: ['jshint']
            },
            other: {
                files: ['<%= webAppDir %>/**/*.html', '<%= webAppDir %>/**/*.js'],
                options: {
                    livereload: true
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['includeSource', 'sass:dist', 'jshint']);

    grunt.registerTask('build', [
        'clean:dist',
        // 'wiredep',
        'includeSource',
        'useminPrepare',
        'ngtemplates',
        'imagemin',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
        // 'compress'
    ]);
};