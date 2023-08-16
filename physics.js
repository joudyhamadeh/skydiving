import * as THREE from 'three'

export class physics
{
    
    constructor(mass  , density  , deltatime , radius  )
    {   
        this.mass = mass ; 
        
        this.gravity_accleration = 9.8 ; 
        
        this.drag_coefficient = 2 ; 
        
        this.density = density ; //density of the fluid.
        
        this.Area = Math.PI * radius**2; //the area of the object facing the fluid

        this.X_Y_Angle = 90 ; // the angle between the vertical vector and X axis 
    
        this.Z_Y_Angle = 90 ; //the angle between the vertical vector and Z axis
    
        this.deltatime = deltatime ;
        
        this.radius = radius ; // the radius of parachute
    }

    calculate_gravity_force()
     {
        let Gravity_Force = new THREE.Vector3(0,-1 * this.mass*this.gravity_accleration , 0 );
        return Gravity_Force;
    }

    calculate_dragForce(velocity)
    {
        let velocity_length = velocity.length() ; 
        
        
        let Drag_Force = new THREE.Vector3( 
                (1/2) * this.drag_coefficient * this.density * this.Area * velocity_length**2 *  Math.cos(this.X_Y_Angle* (Math.PI / 180)) 
            ,   (1/2) * this.drag_coefficient * this.density * this.Area * velocity_length**2  * Math.sin(this.X_Y_Angle* (Math.PI/ 180))*Math.sin(this.Z_Y_Angle* (Math.PI / 180))
            ,   (1/2) * this.drag_coefficient *this.density * this.Area * velocity_length**2  * Math.cos(this.Z_Y_Angle * (Math.PI/ 180))
            ); 

        return Drag_Force ; 
    }

    calculate_Wind_Force(wind_speedx , wind_speedz)
    {
        let Area = Math.PI*(this.radius/2)**2
        

        let wind_Force_x = (1/2) * this.drag_coefficient * this.density * Area * wind_speedx**2 ;
        if(wind_speedx < 0 )
            wind_Force_x = wind_Force_x * -1 ; 


        let wind_Force_z = (1/2) * this.drag_coefficient *this.density * Area * wind_speedz**2  ; 
        if(wind_speedz < 0)
              wind_Force_z = wind_Force_z * -1 ; 


        return new THREE.Vector3(
                 wind_Force_x
            ,   0
            ,   wind_Force_z
            ); 

    }

    calculate_Net_Force(velocity , wind_speedx , wind_speedz , isopen)
    {
        let Drag_Force = this.calculate_dragForce(velocity); 
        let Gravity_Force = this.calculate_gravity_force(); 
        let wind_Force=  this.calculate_Wind_Force(wind_speedx , wind_speedz);  
        var NetForce ; 
        if(! isopen)
            this.drag_coefficient = 0 ; 
        if(isopen)
            this.drag_coefficient = 1.5 ; 
    
            NetForce = new  THREE.Vector3(Drag_Force.x + Gravity_Force.x + wind_Force.x,
            Gravity_Force.y +Drag_Force.y ,
            Gravity_Force.z + Drag_Force.z + wind_Force.z)  ;

        return NetForce ;
    }

    calculate_euler_equation(velocity , position , wind_speedx, wind_speedz ,isopen)
    {
        
        let net_force = this.calculate_Net_Force(velocity , wind_speedx, wind_speedz , isopen) ; 
        
        let acceleration =new THREE.Vector3(net_force.x /this.mass 
        , net_force.y /this.mass,
         net_force.z / this.mass) ;
        
        let new_velocity = new THREE.Vector3(acceleration.x* this.deltatime+ velocity.x , 
            acceleration.y* this.deltatime+ velocity.y , 
            acceleration.z* this.deltatime+ velocity.z )    ; 
        
        let new_position =  new THREE.Vector3 (new_velocity.x *this.deltatime +  position.x ,
            new_velocity.y *this.deltatime +  position.y , 
            new_velocity.z *this.deltatime +  position.z 
            ) ; 
        
            
        return [acceleration , new_velocity , new_position] ; 
    }   

    updateAngle(X_Y_Angle , Z_Y_Angle) 
    {
        this.X_Y_Angle = X_Y_Angle; 
        this.Z_Y_Angle = Z_Y_Angle ; 
    }

}