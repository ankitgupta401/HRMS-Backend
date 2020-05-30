const express =require('express');
const router = express.Router();
const multer = require('multer');
const Employee =  require('../model/employee');
const Leave = require('../model/empLeave');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg' : 'jpg',
  'image/PNG': 'png',
  'image/JPEG': 'jpg',
  'image/JPG' : 'jpg'
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file)
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid MIme Type')
    if(isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
 cb(null, name + '-' + Date.now() + '.' +  ext);
  }
});


router.post("/listEmployee", (req,res,next) => {
Employee.find({deleted: false}).sort({_id:-1}).then((result) => {
  res.status(201).json({
    code: 0,
    result: result,
    message: "Employee Found",
 });
}).catch(err => {
  res.status(500).json({
    code: 1,
    result: err,
    message:"Error Occurred"
   })
});

});

router.post("/addLeave", (req,res,next) => {
let remaining;


const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = new Date(req.body.leaveTo);
const secondDate = new Date(req.body.leaveFrom);

const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

//console.log(diffDays);
Employee.find({phone: req.body.phone , deleted:false}).then(result2 => {
  let data =  result2[0];
  //console.log(result2[0].leaveRemaining);
  data.leaveRemaining = data.leaveRemaining - diffDays;
  remaining = data.leaveRemaining;
  Employee.updateOne({_id: data.id}, data).then(() => {
    let leave  = new Leave({
      ...req.body,
      leaveRemaining: remaining,
      deleted:false
      });
     
    leave.save()
    .then(() => {
      res.status(200).json({
        code: 0,
        result: [],
        message: "The Leave was Added successfully",
      });
     
      }).catch (err => {
    res.status(500).json({
    code: 1,
    result: err,
    message:"Error Occurred"
    })
    })

  });
 });

})

router.post("/leaveLog", (req,res,next) => {
Leave.find({leaveFrom: {"$gte":req.body.from, "$lte": req.body.to }, deleted:false}).sort({_id: -1}).then(result => {
    if(result.length == 0){
      res.status(200).json({
        code: 0,
        result: result,
        message: "Not Found",
     });
    } else {
      res.status(200).json({
        code: 0,
        result: result,
        message: "Found",
     });
    }
   
    
      }).catch (err => {
   res.status(500).json({
    code: 1,
    result: err,
    message:"Error Occured"
   })

  });
});


var cpUpload = multer({storage: storage}).fields([{ name: 'doc1', maxCount: 1 }, { name: 'doc2', maxCount: 1 }]);
router.post("/addEmployee", cpUpload, (req,res,next) => {
  console.log(req.files.doc1[0]);
  url = req.protocol + "://" + req.get("host");
  //console.log(req.body);
  const emp = new Employee({
  ...req.body,
    doc1: url + "/images/" + req.files.doc1[0].filename,
    doc2: url + "/images/" + req.files.doc2[0].filename,
    leaveRemaining: 36,
    deleted: false
  });


  emp.save()
  .then(() => {res.status(200).json({
    code: 0,
    result: [],
    message: "The Employee was Added successfully",
 });
    }).catch (err => {
 res.status(500).json({
  code: 1,
  result: err,
  message:"Error Occurred"
 })
})
 
  //console.log(req.files.doc1[0].fieldname);
  //console.log(url + "/images/" + req.files.doc1[0].filename);
});

router.post("/findEmployee" ,(req,res,next) => {

  Employee.find({phone: req.body.phone , deleted: false}).then(result => {
   // console.log(result.length);
    if(result.length == 0){
      res.status(200).json({
        code: 0,
        result: result,
        message: "Not Found",
     });
    } else {
      res.status(200).json({
        code: 0,
        result: result,
        message: "Found",
     });
    }
   
    
      }).catch (err => {
   res.status(500).json({
    code: 1,
    result: err,
    message:"Error Occured"
   })


  });
});


router.post("/update", (req,res,next) => {
  //console.log(req.body);
  Employee.updateOne({_id: req.body._id}, {...req.body}).then(response => {
    res.status(200).json({
      code: 0,
      result: [],
      message:"Updated"
     })
  
  }).catch(err => {
    res.status(500).json({
      code: 1,
      result: err,
      message:"Error Occured"
     })
  });

});


module.exports = router;