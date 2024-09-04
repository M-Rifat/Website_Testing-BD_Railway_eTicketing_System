import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class ExtentReportManager implements ITestListener {

    public ExtentSparkReporter sparkReporter; //UI of the report
    public ExtentReports extent; //populate common info on the report
    public ExtentTest test; //creating test case entries in the report and update status of the test method

    public void onStart(ITestContext context){
        sparkReporter=new ExtentSparkReporter(System.getProperty("user.dir")+"/myReport.html"); //

        sparkReporter.config().setDocumentTitle("Automation Report");
        sparkReporter.config().setReportName("Functional Testing");
        sparkReporter.config().setTheme(Theme.DARK);

        extent=new ExtentReports();
        extent.attachReporter(sparkReporter);

        extent.setSystemInfo("Device Name","Lenovo");
        extent.setSystemInfo("Tester Name","Mobinul");
        extent.setSystemInfo("OS","Windows10");
        extent.setSystemInfo("Browser Name","Edge");
    }

    public void onTestSuccess(ITestResult result){
        test =extent.createTest(result.getName());
        test.log(Status.PASS,"Test Case Passed is: "+result.getName());
    }

    public void onTestFailure(ITestResult result){
        test =extent.createTest(result.getName());
        test.log(Status.FAIL,"Test Case Failed is: "+result.getName());
        test.log(Status.FAIL,"Failed Cause is: "+result.getThrowable());
    }

    public void onTestSkipped(ITestResult result){
        test =extent.createTest(result.getName());
        test.log(Status.SKIP,"Test Case Skipped is: "+result.getName());
    }

    public void onFinish(ITestContext context){
        extent.flush();
    }
}
