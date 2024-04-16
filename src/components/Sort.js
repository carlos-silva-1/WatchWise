import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

const Sort = ({ sortParameter, handleSortClick }) => {
    return(
        <>
        	<div id="sort">
        		<Navbar expand="lg" variant="dark">
                    <Form>
                    	{
                    		sortParameter.toLowerCase() === "alphabetically"?
                    		<>
                    			<Form.Check className="mr-4" inline type={'radio'} checked={true} name="sort-group" label="Alphabetically" onClick={() => handleSortClick('')}/>
                    		</>
                    		:
                    		<>
                    			<Form.Check className="mr-4" inline type={'radio'} checked={false} name="sort-group" label="Alphabetically" onClick={() => handleSortClick('alphabetically')}/>
                    		</>
                    	}
                        {
                            sortParameter.toLowerCase() === "ranking"?
                            <>
                                <Form.Check className="mr-4" inline type={'radio'} checked={true} name="sort-group" label="Ranking" onClick={() => handleSortClick('')}/>
                            </>
                            :
                            <>
                                <Form.Check className="mr-4" inline type={'radio'} checked={false} name="sort-group" label="Ranking" onClick={() => handleSortClick('ranking')}/>
                            </>
                        }
                        {
                            sortParameter.toLowerCase() === "popularity"?
                            <>
                                <Form.Check className="mr-4" inline type={'radio'} checked={true} name="sort-group" label="Popularity" onClick={() => handleSortClick('')}/>
                            </>
                            :
                            <>
                                <Form.Check className="mr-4" inline type={'radio'} checked={false} name="sort-group" label="Popularity" onClick={() => handleSortClick('popularity')}/>
                            </>
                        }
                        {
                            sortParameter.toLowerCase() === "release date"?
                            <>
                                <Form.Check inline type={'radio'} checked={true} name="sort-group" label="Release Date" onClick={() => handleSortClick('')}/>
                            </>
                            :
                            <>
                                <Form.Check inline type={'radio'} checked={false} name="sort-group" label="Release Date" onClick={() => handleSortClick('release date')}/>
                            </>
                        }
                    </Form>
                </Navbar>
        	</div>    
        </>
    )
}

export default Sort
