module.exports = function(grunt) {
""
  grunt.initConfig({
    watch: {
      less: {
      	files: ['assets/less/*.less'],
      	tasks: ['less']	
      }
      
    },
     less: {
       development: {
		    options: {
		      paths: ["less/"],
          // compress: true,
          yuicompress: false,
          optimization: 2,
          cleancss:false,   
          syncImport: false,
          strictUnits:false,
          strictMath: true,
          strictImports: true,
          ieCompat: false    
		    },
		    files: {
		      "assets/css/main.min.css": "assets/less/main.less",
		    }
      }
    },
  })

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['less']);

};