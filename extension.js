const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.generateFXStructure', function (uri) {
        // Log the folder path for debugging
        //console.log("Folder path:", uri ? uri.fsPath : "No URI provided");

        if (!uri || !uri.fsPath) {
            vscode.window.showErrorMessage('Please right-click on a folder to generate the code structure.');
            return;
        }
        const date = new Date().toISOString().split('T')[0];  // Formats date as YYYY-MM-DD
        const folderPath = uri.fsPath;

        const stats = fs.lstatSync(folderPath);
        if (!stats.isDirectory()) {
            vscode.window.showErrorMessage('The selected path is not a folder!');
            return;
        }
        const lastFolderName = path.basename(folderPath);
        // Define folder paths
        const scrFolder = path.join(folderPath, 'src');
        const mainFolder = path.join(folderPath, 'src/main');
        const javaFolder = path.join(folderPath, 'src/main/java');
        const folderSubPath = `src/main/java/${lastFolderName}`;
       const Folder = path.join(folderPath, folderSubPath);
        const SubPath = `src/main/java/${lastFolderName}/fxcore`;
    //    const Folder = path.join(folderPath, `src/main/java/${lastFolderName}`);
      // const fxcoreFolder = path.join(folderPath, `src/main/java/${lastFolderName}/fxcore`);
  // const fxcoreFolder = path.join(folderPath, 'src/main/java/fxcore');
        const fxcoreFolder = path.join(folderPath, SubPath);
        const resourcesFolder = path.join(folderPath, 'src/main/resources');
        const fxmlFolder = path.join(folderPath, 'src/main/resources/fxml');
        const stylesFolder = path.join(folderPath, 'src/main/resources/styles');

        
vscode.window.showInformationMessage(`${folderPath} ${folderSubPath} ${SubPath}`);
        // Create folders if they don't exist
        if (!fs.existsSync(scrFolder)) fs.mkdirSync(scrFolder);
        if (!fs.existsSync(mainFolder)) fs.mkdirSync(mainFolder);
        if (!fs.existsSync(javaFolder)) fs.mkdirSync(javaFolder);
        if (!fs.existsSync(Folder)) fs.mkdirSync(Folder);
        if (!fs.existsSync(fxcoreFolder)) fs.mkdirSync(fxcoreFolder);
        if (!fs.existsSync(resourcesFolder)) fs.mkdirSync(resourcesFolder);
        if (!fs.existsSync(fxmlFolder)) fs.mkdirSync(fxmlFolder);
        if (!fs.existsSync(stylesFolder)) fs.mkdirSync(stylesFolder);

        // Simple file creation test for debugging
        //fs.writeFileSync(path.join(folderPath, 'test.txt'), 'This is a test file.');

        // Create module-info.java
        const moduleContent = `
module ${lastFolderName}.fxcore {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.media;
    opens ${lastFolderName}.fxcore to javafx.fxml;
    exports ${lastFolderName}.fxcore;
}
`;
        fs.writeFileSync(path.join(javaFolder, 'module-info.java'), moduleContent);

        // Create FXMLController.java
        const fxmlContent = `
package ${lastFolderName}.fxcore;
/*
By: <Your Name Here>
Date: ${date}
Program Details: <Program Description Here>
*/
import java.net.URL;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;

public class FXMLController implements Initializable {
    
    @FXML
    private Label lblOut;
    
    @FXML
    private void btnClickAction(ActionEvent event) {
        lblOut.setText("Hello World!");
    }
    
    @Override
    public void initialize(URL url, ResourceBundle rb) {
        // TODO
    }    
}
`;

        // Create FXMLController.java
        const mainContent = `
package ${lastFolderName}.fxcore;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;


public class MainApp extends Application {
    private static Stage stage;

    @Override
    public void start(@SuppressWarnings("exports") Stage s) throws IOException {
        stage=s;
        setRoot("primary","");
    }

    static void setRoot(String fxml) throws IOException {
        setRoot(fxml,stage.getTitle());
    }

    static void setRoot(String fxml, String title) throws IOException {
        Scene scene = new Scene(loadFXML(fxml));
        stage.setTitle(title);
        stage.setScene(scene);
        stage.show();
    }

    private static Parent loadFXML(String fxml) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(MainApp.class.getResource("/fxml/"+fxml + ".fxml"));
        return fxmlLoader.load();
    }


    public static void main(String[] args) {
        launch(args);
    }

}
`;



        fs.writeFileSync(path.join(fxcoreFolder, 'FXMLController.java'), fxmlContent);
        fs.writeFileSync(path.join(fxcoreFolder, 'MainApp.java'), mainContent);

        // Create fxlm file
        const uiContent = `<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>

<AnchorPane id="AnchorPane" prefHeight="200" prefWidth="320" xmlns:fx="http://javafx.com/fxml/1" xmlns="http://javafx.com/javafx/10.0.2-internal" fx:controller="${lastFolderName}.fxcore.FXMLController">
    <children>
        <Button layoutX="128.0" layoutY="107.0" onAction="#btnClickAction" text="Click Me!" />
        <Label fx:id="lblOut" layoutX="53.0" layoutY="30.0" minHeight="16" minWidth="69" prefHeight="52.0" prefWidth="215.0" />
    </children>
</AnchorPane>
`;
    fs.writeFileSync(path.join(fxmlFolder, 'primary.fxml'), uiContent);
    // Create css file
    const sytleContent = `
/*
Made by:  Jasper Potts
Date: Dec 20, 2011
Purpose: CSS options for JavaFX
http://fxexperience.com/2011/12/styling-fx-buttons-with-css/

*/


.round-red {
    -fx-background-color: linear-gradient(#ff5400, #be1d00);
    -fx-background-radius: 30;
    -fx-background-insets: 0;
    -fx-text-fill: white;
}
.bevel-grey {
    -fx-background-color:
        linear-gradient(#f2f2f2, #d6d6d6),
        linear-gradient(#fcfcfc 0%, #d9d9d9 20%, #d6d6d6 100%),
        linear-gradient(#dddddd 0%, #f6f6f6 50%);
    -fx-background-radius: 8,7,6;
    -fx-background-insets: 0,1,2;
    -fx-text-fill: black;
    -fx-effect: dropshadow( three-pass-box , rgba(0,0,0,0.6) , 5, 0.0 , 0 , 1 );
}

.shiny-orange {
    -fx-background-color:
        linear-gradient(#ffd65b, #e68400),
        linear-gradient(#ffef84, #f2ba44),
        linear-gradient(#ffea6a, #efaa22),
        linear-gradient(#ffe657 0%, #f8c202 50%, #eea10b 100%),
        linear-gradient(from 0% 0% to 15% 50%, rgba(255,255,255,0.9), rgba(255,255,255,0));
    -fx-background-radius: 30;
    -fx-background-insets: 0,1,2,3,0;
    -fx-text-fill: #654b00;
    -fx-padding: 10 20 10 20;
}
.dark-blue {
    -fx-background-color:
        #090a0c,
        linear-gradient(#38424b 0%, #1f2429 20%, #191d22 100%),
        linear-gradient(#20262b, #191d22),
        radial-gradient(center 50% 0%, radius 100%, rgba(114,131,148,0.9), rgba(255,255,255,0));
    -fx-background-radius: 5,4,3,5;
    -fx-background-insets: 0,1,2,0;
    -fx-text-fill: white;
    -fx-effect: dropshadow( three-pass-box , rgba(0,0,0,0.6) , 5, 0.0 , 0 , 1 );
    -fx-text-fill: linear-gradient(white, #d0d0d0);
    -fx-padding: 10 20 10 20;
}
.dark-blue Text {
    -fx-effect: dropshadow( one-pass-box , rgba(0,0,0,0.9) , 1, 0.0 , 0 , 1 );
}
.record-sales {
    -fx-padding: 8 15 15 15;
    -fx-background-insets: 0,0 0 5 0, 0 0 6 0, 0 0 7 0;
    -fx-background-radius: 8;
    -fx-background-color:
        linear-gradient(from 0% 93% to 0% 100%, #a34313 0%, #903b12 100%),
        #9d4024,
        #d86e3a,
        radial-gradient(center 50% 50%, radius 100%, #d86e3a, #c54e2c);
    -fx-effect: dropshadow( gaussian , rgba(0,0,0,0.75) , 4,0,0,1 );

}
.record-sales:hover {
    -fx-background-color:
        linear-gradient(from 0% 93% to 0% 100%, #a34313 0%, #903b12 100%),
        #9d4024,
        #d86e3a,
        radial-gradient(center 50% 50%, radius 100%, #ea7f4b, #c54e2c);
}
.record-sales:pressed {
    -fx-padding: 10 15 13 15;
    -fx-background-insets: 2 0 0 0,2 0 3 0, 2 0 4 0, 2 0 5 0;
}
.record-sales Text {
    -fx-fill: white;
    -fx-effect: dropshadow( gaussian , #a30000 , 0,0,0,2 );
}
.rich-blue {
    -fx-background-color:
        #000000,
        linear-gradient(#7ebcea, #2f4b8f),
        linear-gradient(#426ab7, #263e75),
        linear-gradient(#395cab, #223768);
    -fx-background-insets: 0,1,2,3;
    -fx-background-radius: 3,2,2,2;
    -fx-padding: 12 30 12 30;
    -fx-text-fill: white;

}
.rich-blue Text {
    -fx-effect: dropshadow( one-pass-box , rgba(0,0,0,0.8) , 0, 0.0 , 0 , 1);
}
.big-yellow {
    -fx-background-color:
        #ecebe9,
        rgba(0,0,0,0.05),
        linear-gradient(#dcca8a, #c7a740),
        linear-gradient(#f9f2d6 0%, #f4e5bc 20%, #e6c75d 80%, #e2c045 100%),
        linear-gradient(#f6ebbe, #e6c34d);
    -fx-background-insets: 0,9 9 8 9,9,10,11;
    -fx-background-radius: 50;
    -fx-padding: 15 30 15 30;
    -fx-text-fill: #311c09;
    -fx-effect: innershadow( three-pass-box , rgba(0,0,0,0.1) , 2, 0.0 , 0 , 1);
}
.big-yellow Text {
    -fx-effect: dropshadow( one-pass-box , rgba(255,255,255,0.5) , 0, 0.0 , 0 , 1);
}
.iphone-toolbar {
    -fx-background-color: linear-gradient(#98a8bd 0%, #8195af 25%, #6d86a4 100%);
}
.iphone {
    -fx-background-color:
        #a6b5c9,
        linear-gradient(#303842 0%, #3e5577 20%, #375074 100%),
        linear-gradient(#768aa5 0%, #849cbb 5%, #5877a2 50%, #486a9a 51%, #4a6c9b 100%);
    -fx-background-insets: 0 0 -1 0,0,1;
    -fx-background-radius: 5,5,4;
    -fx-padding: 7 30 7 30;
    -fx-text-fill: #242d35;
    -fx-text-fill: white;
}
.iphone Text {
    -fx-effect: dropshadow( one-pass-box , rgba(0,0,0,0.8) , 0, 0.0 , 0 , -1 );
}
.ipad-dark-grey {
    -fx-background-color:
        linear-gradient(#686868 0%, #232723 25%, #373837 75%, #757575 100%),
        linear-gradient(#020b02, #3a3a3a),
        linear-gradient(#9d9e9d 0%, #6b6a6b 20%, #343534 80%, #242424 100%),
        linear-gradient(#8a8a8a 0%, #6b6a6b 20%, #343534 80%, #262626 100%),
        linear-gradient(#777777 0%, #606060 50%, #505250 51%, #2a2b2a 100%);
    -fx-background-insets: 0,1,4,5,6;
    -fx-background-radius: 9,8,5,4,3;
    -fx-padding: 15 30 15 30;
    -fx-text-fill: white;
    -fx-effect: dropshadow( three-pass-box , rgba(255,255,255,0.2) , 1, 0.0 , 0 , 1);
}
.ipad-dark-grey Text {
    -fx-effect: dropshadow( one-pass-box , black , 0, 0.0 , 0 , -1 );
}
.ipad-grey {
    -fx-background-color:
        linear-gradient(#686868 0%, #232723 25%, #373837 75%, #757575 100%),
        linear-gradient(#020b02, #3a3a3a),
        linear-gradient(#b9b9b9 0%, #c2c2c2 20%, #afafaf 80%, #c8c8c8 100%),
        linear-gradient(#f5f5f5 0%, #dbdbdb 50%, #cacaca 51%, #d7d7d7 100%);
    -fx-background-insets: 0,1,4,5;
    -fx-background-radius: 9,8,5,4;
    -fx-padding: 15 30 15 30;
    -fx-text-fill: #333333;
    -fx-effect: dropshadow( three-pass-box , rgba(255,255,255,0.2) , 1, 0.0 , 0 , 1);
}
.ipad-grey Text {
    -fx-effect: dropshadow( one-pass-box , white , 0, 0.0 , 0 , 1 );
}
.lion-default {
    -fx-background-color:
        rgba(0,0,0,0.08),
        linear-gradient(#5a61af, #51536d),
        linear-gradient(#e4fbff 0%,#cee6fb 10%, #a5d3fb 50%, #88c6fb 51%, #d5faff 100%);
    -fx-background-insets: 0 0 -1 0,0,1;
    -fx-background-radius: 5,5,4;
    -fx-padding: 3 30 3 30;
    -fx-text-fill: #242d35;
}
.lion {
    -fx-background-color:
        rgba(0,0,0,0.08),
        linear-gradient(#9a9a9a, #909090),
        linear-gradient(white 0%, #f3f3f3 50%, #ececec 51%, #f2f2f2 100%);
    -fx-background-insets: 0 0 -1 0,0,1;
    -fx-background-radius: 5,5,4;
    -fx-padding: 3 30 3 30;
    -fx-text-fill: #242d35;
}
.windows7-default {
    -fx-background-color:
        #3c7fb1,
        linear-gradient(#fafdfe, #e8f5fc),
        linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);
    -fx-background-insets: 0,1,2;
    -fx-background-radius: 3,2,1;
    -fx-padding: 3 30 3 30;
    -fx-text-fill: black;
}
.windows7 {
    -fx-background-color:
        #707070,
        linear-gradient(#fcfcfc, #f3f3f3),
        linear-gradient(#f2f2f2 0%, #ebebeb 49%, #dddddd 50%, #cfcfcf 100%);
    -fx-background-insets: 0,1,2;
    -fx-background-radius: 3,2,1;
    -fx-padding: 3 30 3 30;
    -fx-text-fill: black;

}
`;
       
        fs.writeFileSync(path.join(stylesFolder, 'styles.css'), sytleContent);

 // Create pom file
 const pom = `
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>fxcore</groupId>
    <artifactId>${lastFolderName}</artifactId>
    <version>1.0</version>
    <packaging>jar</packaging>
    <name>keywork</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <mainClass>${lastFolderName}.fxcore.MainApp</mainClass>
    </properties>

    <organization>
        <!-- Used as the 'Vendor' for JNLP generation -->
        <name>Your Organisation</name>
    </organization>

    <dependencies>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-fxml</artifactId>
            <version>23</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-media</artifactId>
            <version>23</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- sets up the version of Java you are running and compiles the Code -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>23</release>
                </configuration>
                <dependencies>
                    <dependency>
                        <groupId>org.ow2.asm</groupId>
                        <artifactId>asm</artifactId>
                        <version>6.2.1</version>
                    </dependency>
                </dependencies>
            </plugin>

            <!-- used to run the program -->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>1.6.0</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>exec</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <mainClass>\${mainClass}</mainClass>
                </configuration>
            </plugin>

            <!-- adds the mainClass to the jar so it will run outside -->
            <plugin>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>\${mainClass}</mainClass>
                        </manifest>
                    </archive>
                    <outputDirectory>
                        \${project.build.directory}/modules
                    </outputDirectory>
                </configuration>
            </plugin>

            <!-- copies the dependency FX files to your program -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>3.1.1</version>
                <executions>
                    <execution>
                        <id>copy-dependencies</id>
                        <phase>prepare-package</phase>
                        <goals>
                            <goal>copy-dependencies</goal>
                        </goals>
                        <configuration>
                            <outputDirectory>\${project.build.directory}/modules</outputDirectory>
                            <includeScope>runtime</includeScope>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
`;


fs.writeFileSync(path.join(folderPath, 'pom.xml'), pom);


        // Show success message
        vscode.window.showInformationMessage('Code structure generated successfully!');
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
