import { Swiper, SwiperSlide} from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
// import Navigation
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css'
import './swiper.css'
import { Box } from '@chakra-ui/react'
// import './'

export const RuleExplanation = () => {
    return(
        // <Box
        //     // height="70vh"
        //     // display="flex"
        //     // alignItems="center"
        //     // justifyContent="center"
        // >
            <Swiper
                className='slider'
                modules={[Navigation, Pagination]}
                navigation
                pagination
                // autoplay={{ delay:2000}}
            >
                <SwiperSlide>
                    <p>test1</p>
                </SwiperSlide>
                <SwiperSlide>
                    <p>test2</p>
                </SwiperSlide>
                <SwiperSlide>
                    <p>test3</p>
                </SwiperSlide>
            </Swiper>
        // </Box>
    )
}