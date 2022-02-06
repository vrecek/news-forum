import React from 'react';
import Button from '../Reusable/Button';
import test from '../../images/test.png'

const SliderText = ({ title, text, src }) => {
   return (
      <div>
         <figure>
            <img src={ src } alt='test' />
         </figure>
         <h3>{ title }</h3>
         <p>{ text }</p>
         <Button text='Continue reading' cname='n' />
      </div>
   )
};

SliderText.defaultProps = {
   text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
   title: 'Default title',
   src: test
}

export default SliderText;
