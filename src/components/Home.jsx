import React, { useContext, useEffect } from 'react'
import './course.css'
import userImage from '../assets/user.png'
import userImage2 from '../assets/user2.png'
import userImage3 from '../assets/user3.png'
import userImage4 from '../assets/user4.png'
import { getRandomColor, getRandomUser } from './random'
import { StudentDetailsContext } from './contexts/StudentDetailsContext'

import Axios from 'axios'
import { toast } from 'react-toastify'
import { RefreshCcw, RefreshCw, RotateCcw } from 'react-feather'
import { Link } from 'react-router-dom'



let randomUser = getRandomUser()

let localdata = JSON.parse(localStorage.getItem('userDetails'))
let user = localdata ? localdata : {
		fname: "",
		lname: "",
		email: "",
		password: "",
		_id: "404"
}
let {_id, fname, lname, email, year, department} = user;
console.log(_id)

let userType = JSON.parse(localStorage.getItem('userType'))
let theme = JSON.parse(localStorage.getItem('theme'))

const CourseBox = ({courseID,courseTitle, year, dept, teacher, teacherImage, numberOfStudents,course_code}) => {

	
	let yearF = year.toUpperCase()
	let deptF = dept.toUpperCase()
	const color = getRandomColor()
	if(userType === 'teacher') {
		teacher = fname.charAt(0).toUpperCase().concat(fname.slice(1,fname.length)).concat(' ').concat(lname.charAt(0).toUpperCase().concat(lname.slice(1,lname.length)))
	}

	return (
		//<Link to={`/course1`}>
		<div className="course-box" onClick={() => {

			Axios.get(`https://dbms-back.herokuapp.com/course/${course_code}`, {
			header: {
				"Content-Type": "application/json; charset=utf-8"
			}
		})
		.then(res => {	
			let a = res.data.data;
			let course = a[0];
			localStorage.setItem('course',JSON.stringify(course))

			Axios.get(`https://dbms-back.herokuapp.com/teacher/${course.teacher_id}`)
				.then(res => {
					//console.log(res.data.data[0])
					//console.log(res.data.data[0])
					localStorage.setItem('courseTeacher',JSON.stringify(res.data.data[0]))
					window.location.href="/course1"
					//console.log(JSON.parse(localStorage.getItem('courseTeacher')))
				})
			
			
			//console.log(course)
		})
		.catch((err) => console.log(err))

			localStorage.setItem('currentCourseCode',course_code)
		}}>
			<div className="course-box-top" style={{backgroundColor: color,}}>
				<h3>{courseTitle}</h3>
				<h6>{yearF} {deptF}</h6>
			</div>
			<div className="course-box-bottom"  style={{ borderTopWidth: 0}}>
				<div className="instructor-box" style={{marginTop: 5}}>
					<div className="changeColorBG" style={{width: 35, height: 35, borderRadius: 25, backgroundColor: '#eee', display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexDirection: "row"}}>
						<img className="changeColorBG" src={userImage} style={{width: 30, height: 30, marginRight: 0, marginTop: 5}}/>
					</div>
					<div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
						<p style={{fontSize: 12, color: '#878787', fontFamily: 'Poppins', fontWeight: 500, margin:0, padding: 0, letterSpacing: 0.4}}>INSTRUCTOR</p>
						<h6 className="sub" style={{fontSize: 15.5, color: '#232323', fontFamily: 'Poppins', fontWeight: 600, margin:0, padding: 0,}}>{teacher}</h6>
					</div>
				</div>

				<div className="students-box">
					<div className="students-box-circle" style={{marginLeft: 0, background: '#09a407'}}><img src={userImage}/></div>
					<div className="students-box-circle" style={{marginLeft: 17,  background: '#0F98D9', transform: 'scale(1.02)'}}><img src={userImage3}/></div>
					<div className="students-box-circle" style={{marginLeft: 34,  background: '#545454', transform: 'scale(1.05)'}}><img src={userImage4}/></div>
					<p className="sub" style={{marginLeft: 70, fontFamily:'Poppins', fontSize: 13, color: '#434343', fontWeight: 500, marginTop: 30}}>{numberOfStudents} students enrolled</p>
				</div>
			</div>
		</div>
//		</Link>
	)
}



const MyCourses = (props) => {

	const [courses, setCourses] = React.useState([])
	const [courseTeachers, setCourseTeachers] = React.useState([])
	const [ignoredVar , update] = React.useState(0)

	const forceUpdate = React.useCallback(() => update(v => v + 1), [])

	React.useEffect(() => {
			if(userType === 'teacher') return 
			toast.info('Fetching courses...')
			Axios.get(`https://dbms-back.herokuapp.com/coursesenrolled/${_id}`, {
				header: {
					"Content-Type": "application/json; charset=utf-8"
				}
			})
			.then(res => {	
				if(res.data.success) {
					setCourses(res.data.data)
					toast.success('Fetched courses')
				} else {
					return toast.error('Error fetching courses')
				}			
			})
			.catch(() => toast.error('Could not fetch your courses. Please try again'))
	}, [ignoredVar])

	React.useEffect(() => {
		if(userType === 'student') return 
		console.log('fetching courses for teacher', _id)
		toast.info('Fetching courses...')
		Axios.get(`https://dbms-back.herokuapp.com/coursebyteacher/${_id}`, {
			header: {
				"Content-Type": "application/json; charset=utf-8"
			}
		})
		.then(res => {	
			if(res.data.success) {
				setCourses(res.data.data)
				toast.success('Fetched courses')
			} else {
				return toast.error('Error fetching courses')
			}			
		})
		.catch(() => toast.error('Could not fetch your courses. Please try again'))
		console.log(courses)
	}, [ignoredVar])

	const getTeachers = () => {
		 
		courses.map(course => {
			// replace 11 by ${course.teacher_id}
			Axios.get(`https://dbms-back.herokuapp.com/teacher/${course.teacher_id}`, {
				header: {
					"Content-Type": "application/json; charset=utf-8"
				}
			})
			.then (res => {
				setCourseTeachers(old => [...old, res.data.data[0].fname.concat(' ').concat(res.data.data[0].lname)] )
			})
			.catch(() => toast.error('Error fetching courses'))
		})
		return courseTeachers
	}

	React.useEffect(() => {
		if(userType ==='teacher') return 
		getTeachers()
	}, [courses])
	
	
	
	
	return (
		
		<div className="course-container">
			
			
			<div className="settings-icon" style={{position: "absolute", top: 100, right: 15}} onClick={forceUpdate}>
					<RotateCcw size={21} color="#09a407" className="changeColor"/>
			</div>
			
			<div style={{width: 'auto', display: "flex", flexDirection: "row", alignItems: "center", marginTop: 20, marginLeft: 15}}>
                <div className="changeColorBG" style={{width: '5rem', height: '5rem', borderRadius: '5rem', backgroundColor: '#eeeeee', display: "flex", alignItems: 'center', justifyContent: "center", overflow: "hidden"}}>
                    <img src={userImage} style={{width: '4.5rem', marginTop: 10}} className="changeColorBG"/>
                </div>
								<div style={{marginLeft: '1rem'}}>
									<h2 className="changeColor" style={{textAlign: "left", fontFamily: 'Poppins', color: theme === 'dark' ? '#eee' : '#232323', fontWeight: 600, fontSize: 28}}>
									{user.fname} {user.lname}</h2>
									<p className="sub" style={{fontFamily: 'Poppins', fontSize: 17, color: '#545454', fontWeight: 600, margin:0, textAlign: 'left'}}>
										{userType[0].toUpperCase() + userType.slice(1,userType.length)}</p>
								<p className="sub" style={{fontFamily: 'Poppins', fontSize: 16, color: '#545454', fontWeight: 500, margin:0, textAlign: "left"}}>
								{year} {department}</p>
                </div>
            </div>


			<p className="sub" style={{fontSize: 20, color: '#545454', fontFamily: 'Poppins', fontWeight: 600, margin:0, padding: 0, marginTop: 35, marginBottom: 5, marginLeft: 20}}>My Courses</p>
			<div className="my-courses-box">
				{/* <CourseBox courseTitle="Operating Systems" year="te" dept="IT" teacher="Satish Kamble" numberOfStudents={60}/>
				<CourseBox courseTitle="Database Management Systems" year="te" dept="IT" teacher="Nilesh Sonawane" numberOfStudents={56}/>
				<CourseBox courseTitle="Theory of Computation" year="te" dept="IT" teacher="Shubhangi Deshpande" numberOfStudents={54}/>
				<CourseBox courseTitle="Software Engineering and Project Management" year="te" dept="IT" teacher="Surendra Mahajan" numberOfStudents={69}/>
				<CourseBox courseTitle="Database Management Systems" year="te" dept="IT" teacher="Nilesh Sonawane" numberOfStudents={56}/>
				<CourseBox courseTitle="Theory of Computation" year="te" dept="IT" teacher="Shubhangi Deshpande" numberOfStudents={54}/>
				<CourseBox courseTitle="Software Engineering and Project Management" year="te" dept="IT" teacher="Surendra Mahajan" numberOfStudents={69}/> */}

				{courses ? 
					courses.map((course, index) => {
						return <CourseBox courseID={course._id} course_code={course.course_code} key={index} courseTitle={course.name} year={course.year} dept={course.department} teacher={courseTeachers[index]} numberOfStudents={56}/>
					})
				: null
				}
			
			
			</div>
			
		</div>
	)
}

export default MyCourses
