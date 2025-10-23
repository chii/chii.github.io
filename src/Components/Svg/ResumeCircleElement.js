import element from "../../assets/images/circle-resume.svg"
import { ImageElement, StyledMotionDiv } from "./Svg.styled"

import motion from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { gsap, Power4, Back } from 'gsap'

//import "./temp.css"

const ResumeCircleElement = () => {
    //const targetRef = useRef();
    //const [pos, setPos] = useState([0,0])
    //const onMove = e => {
    //    setPos([e.clientX, e.clientY])
    //    console.log(e.clientX)
    //    targetRef.current.style.transform = `translate3d(${e.clientX -
    //        targetRef.current.clientWidth / 2}px, ${e.clientY -
    //        targetRef.current.clientHeight / 2}px, 0)`;
    //}
    //useEffect tutorial
    const callbackFn = () => console.log('副作用関数が実行されました')
    useEffect(callbackFn,[])

    /////////////////////////////////////////////////
    //const wrapperDiv = {
    //    position: 'relative'
    //}
    const parentRef = useRef()
    //console.log(parentRef)
    const followerRef = useRef()
    const onMouseMove = (e) => {
        gsap.to(followerRef.current, 0, {
            x: e.offsetX,
            y: e.offsetY,
            ease:Power4.easeOut
        })
        gsap.set(followerRef.current, {
            xPercent: 0,
            yPercent: 0
        })
    }
    const onMouseLeave = (e) => {
        const rect = followerRef.current.getBoundingClientRect()
        const center = {
            w: Math.round(rect.width * 0.5),
            h: Math.round(rect.height * 0.5)
        }
        console.log(center)
        const trg = followerRef.current;

        gsap.to(trg, 1, {
            x: center.w,
            y: center.h,
            ease: Back.easeInOut
        })
        gsap.set(trg, {
            xPercent: 0,
            yPercent: 0
        })
    }
    useEffect(() => {
        //if (parentRef && parentRef.current){
            parentRef.current.addEventListener('mousemove', onMouseMove);
            return () => parentRef.current.removeEventListener("mousemove", onMouseMove);
        //}
    }, [])
    useEffect(() => {
        //if (parentRef && parentRef.current){
        parentRef.current.addEventListener('mouseleave', onMouseLeave);
        return () => parentRef.current.removeEventListener("mouseleave", onMouseLeave);
        //}
    }, [])
    const parentDiv = {
        position: "absolute",
        width: 120,
        height: 120,
        border: "1px dotted red",
        top: "50%",
        left: "50%"
    }
    return (
        <div style={parentDiv} ref={parentRef}>
            <ImageElement
                src={element}
                ref={followerRef}
                //onPointerMove={onMove}
                className="follower"
            />
        </div>
    )
}
//const spinTransition = {
//    loop: Infinity,
//    ease: "linear",
//    duration: 50
//}
//
//const ResumeCircleElement = () => {
//    return (
//        <ImageElement
//            src={element}
//            animate={{ rotate: 360 }}
//            transition={ spinTransition }
//        />
//    )
//}
//const ResumeCircleElement = () => {
//    const secondaryCursor = useRef(null);
//    const mainCursor = useRef(null);
//    const positionRef = useRef({
//        mouseX: 0,
//        mouseY: 0,
//        destinationX: 0,
//        destinationY: 0,
//        distanceX: 0,
//        distanceY: 0,
//        key: -1,
//    });
//    useEffect(() => {
//        secondaryCursor.current.addEventListener("mousemove", (event) => {
//            const { clientX, clientY } = event;
//
//            const mouseX = clientX;
//            const mouseY = clientY;
//
//            positionRef.current.mouseX =
//                mouseX - secondaryCursor.current.clientWidth / 2;
//            positionRef.current.mouseY =
//                mouseY - secondaryCursor.current.clientHeight / 2;
//            mainCursor.current.style.transform = `translate3d(${mouseX -
//                mainCursor.current.clientWidth / 2}px, ${mouseY -
//                mainCursor.current.clientHeight / 2}px, 0)`;
//        });
//
//        return () => {};
//    }, []);
//
//    useEffect(() => {
//        const followMouse = () => {
//            positionRef.current.key = requestAnimationFrame(followMouse);
//            const {
//                mouseX,
//                mouseY,
//                destinationX,
//                destinationY,
//                distanceX,
//                distanceY,
//            } = positionRef.current;
//            if (!destinationX || !destinationY) {
//                positionRef.current.destinationX = mouseX;
//                positionRef.current.destinationY = mouseY;
//            } else {
//                positionRef.current.distanceX = (mouseX - destinationX) * 0.1;
//                positionRef.current.distanceY = (mouseY - destinationY) * 0.1;
//                if (
//                    Math.abs(positionRef.current.distanceX) +
//                    Math.abs(positionRef.current.distanceY) <
//                    0.1
//                ) {
//                    positionRef.current.destinationX = mouseX;
//                    positionRef.current.destinationY = mouseY;
//                } else {
//                    positionRef.current.destinationX += distanceX;
//                    positionRef.current.destinationY += distanceY;
//                }
//            }
//            secondaryCursor.current.style.transform = `translate3d(${destinationX}px, ${destinationY}px, 0)`;
//        };
//        followMouse();
//    }, []);
//
//    return (
//        <>
//            <div className="main-cursor " ref={mainCursor}>
//                <div className="main-cursor-background"></div>
//            </div>
//            <div className="secondary-cursor" ref={secondaryCursor}>
//                <div className="cursor-background"></div>
//            </div>
//        <ImageElement
//            src={element}
//            //whileHover={}
//            onHoverStart={() => console.log("starts")}
//            onHoverEnd={() => console.log("ends")}
//            //ref={secondaryCursor}
//        />
//        </>
//    )
//}
export default ResumeCircleElement;

