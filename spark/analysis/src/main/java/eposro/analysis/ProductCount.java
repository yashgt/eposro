package eposro.analysis;

import scala.Tuple2;
import org.apache.hadoop.conf.*;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.PairFunction;

import org.bson.BSONObject;
import com.mongodb.hadoop.*;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;


public final class ProductCount {
	private static final Pattern SPACE = Pattern.compile(" ");

	public static void main(String[] args) throws Exception {
		
		SparkConf sparkConf = new SparkConf().setMaster("local").setAppName("JavaWordCount");
	    JavaSparkContext sc = new JavaSparkContext(sparkConf);
	    
	// Set configuration options for the MongoDB Hadoop Connector.
	Configuration mongodbConfig = new Configuration();
	// MongoInputFormat allows us to read from a live MongoDB instance.
	// We could also use BSONFileInputFormat to read BSON snapshots.
	mongodbConfig.set("mongo.job.input.format",
					  "com.mongodb.hadoop.MongoInputFormat");
	// MongoDB connection string naming a collection to use.
	// If using BSON, use "mapred.input.dir" to configure the directory
	// where BSON files are located instead.
	mongodbConfig.set("mongo.input.uri",
					  "mongodb://localhost:40000/eposro.products");

	// Create an RDD backed by the MongoDB collection.
	JavaPairRDD<Object, BSONObject> documents = sc.newAPIHadoopRDD(
		mongodbConfig,            // Configuration
		MongoInputFormat.class,   // InputFormat: read from a live cluster.
		Object.class,             // Key class
		BSONObject.class          // Value class
	);

	System.out.println(documents.count());

	/*
	// Create a separate Configuration for saving data back to MongoDB.
	Configuration outputConfig = new Configuration();
	outputConfig.set("mongo.output.uri",
					 "mongodb://localhost:27017/output.collection");

	// Save this RDD as a Hadoop "file".
	// The path argument is unused; all documents will go to 'mongo.output.uri'.
	documents.saveAsNewAPIHadoopFile(
		"file:///this-is-completely-unused",
		Object.class,
		BSONObject.class,
		MongoOutputFormat.class,
		outputConfig
	);

	// We can also save this back to a BSON file.
	documents.saveAsNewAPIHadoopFile(
		"hdfs://localhost:8020/user/spark/bson-demo",
		Object.class,
		BSONObject.class,
		BSONFileOutputFormat.class,
		new Configuration()
	);
	*/

	}
}