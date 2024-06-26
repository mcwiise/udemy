package com

import org.gradle.api.*

public class MyAWSPlugin implements Plugin<Project> {
    public void apply(Project project){
        project.task("copyToS3"){
            doLast(){
                println "Copied to S3" 
            }
        }

        project.task("deployToEC2"){
            doLast(){
                println "Application is up and running in EC2" 
            }
        }
    }
}